const axios = require('axios');
// const { MongoClient } = require('mongodb');
const { hangzhouPlanModel, mongoose } = require('../models');
const log4js = require('log4js');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

// 日志配置
const logger = log4js.getLogger();
logger.level = 'info';

// 项目配置
const CONFIG = {
    BASE_URL: 'https://ghzy.hangzhou.gov.cn',
    LIST_URL: 'https://ghzy.hangzhou.gov.cn/col/col1228968050/index.html',
    API_PATH: '/api-gateway/jpaas-publish-server/front/page/build/unit',

    // 请求配置
    REQUEST_TIMEOUT: 30000,
    REQUEST_DELAY: 1000,
    USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',

    // 下载配置
    DOWNLOAD_DIR: './downloads/images',

    // 抓取模式
    USE_API_FIRST: true,  // 优先使用API
    USE_PUPPETEER_FALLBACK: true,  // API失败时使用Puppeteer
};

/**
 * 项目抓取器 - 混合模式
 */
class HybridProjectCrawler {
    constructor() {
        this.baseUrl = CONFIG.BASE_URL;
        this.headers = {
            'User-Agent': CONFIG.USER_AGENT,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        };

        // this.mongoClient = null;
        // this.db = null;
    }

    /**
     * 安全请求函数
     */
    async safeRequest(url, options = {}) {
        try {
            logger.info(`请求: ${url}`);

            const response = await axios({
                url,
                timeout: CONFIG.REQUEST_TIMEOUT,
                headers: this.headers,
                ...options
            });

            return response;
        } catch (error) {
            logger.error(`请求失败 ${url}:`, error.message);

            if (error.response) {
                logger.warn(`响应状态: ${error.response.status} ${error.response.statusText}`);
            }

            throw error;
        }
    }

    /**
     * 解析API查询参数
     */
    parseQueryData(queryString) {
        try {
            // 将单引号转换为双引号
            const jsonStr = queryString.replace(/'/g, '"');
            return JSON.parse(jsonStr);
        } catch (error) {
            logger.error('解析查询参数失败:', error.message);
            return null;
        }
    }

    /**
     * 方法1: 尝试通过API获取项目数据
     */
    async fetchProjectsByAPI() {
        try {
            logger.info('尝试通过API获取项目数据...');

            // 1. 获取列表页，提取API参数
            const listResponse = await this.safeRequest(CONFIG.LIST_URL);
            const html = listResponse.data;

            // 2. 查找API参数
            const scriptMatch = html.match(/queryData="([^"]+)"/);

            if (!scriptMatch) {
                throw new Error('未找到API参数');
            }

            const queryData = this.parseQueryData(scriptMatch[1]);
            logger.info(`queryData...:${queryData}`);
            if (!queryData) {
                throw new Error('解析API参数失败');
            }

            logger.info('API参数:', JSON.stringify(queryData, null, 2));

            // 3. 调用API
            const apiUrl = `${this.baseUrl}${CONFIG.API_PATH}`;
            logger.info(`调用API: ${apiUrl}`);

            const apiResponse = await this.safeRequest(apiUrl, {
                params: queryData,
                headers: {
                    ...this.headers,
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': CONFIG.LIST_URL
                }
            });

            // 4. 解析API响应
            const apiData = apiResponse.data.data;
            logger.info(`API响应类型: ${typeof apiData}`);
            logger.info(`API响应: ${JSON.stringify(apiData)}`);
            // 保存API响应用于调试
            await fs.ensureDir('./debug');
            await fs.writeFile('./debug/api-response.json', JSON.stringify(apiData, null, 2));

            // 5. 提取项目数据
            const projects = this.extractProjectsFromAPIResponse(apiData);
            logger.info(`从API获取到 ${projects.length} 个项目`);

            return projects;

        } catch (error) {
            logger.warn('API方法失败:', error.message);
            return null;
        }
    }

    /**
     * 从API响应中提取项目
     */
    extractProjectsFromAPIResponse(apiData) {
        const projects = [];

        // 尝试不同的数据结构
        let htmlContent = '';

        if (typeof apiData === 'string') {
            htmlContent = apiData;
        } else if (apiData && typeof apiData === 'object') {
            if (apiData.html) {
                htmlContent = apiData.html;
            } else if (apiData.data) {
                // 尝试将data转换为字符串
                htmlContent = typeof apiData.data === 'string' ? apiData.data : JSON.stringify(apiData.data);
            } else {
                // 尝试序列化整个对象
                htmlContent = JSON.stringify(apiData);
            }
        }

        if (!htmlContent) {
            logger.warn('API响应中未找到有效内容');
            return projects;
        }

        // 使用cheerio解析HTML
        const $ = cheerio.load(htmlContent);

        // 查找项目行
        $('tr.DGtable_item').each((index, row) => {
            const link = $(row).find('td.td1 a');
            if (link.length) {
                const project = this.extractProjectFromRow($, row);
                if (project) {
                    projects.push(project);
                }
            }
        });

        return projects;
    }

    /**
     * 从表格行中提取项目信息
     */
    extractProjectFromRow($, row) {
        try {
            const link = $(row).find('td.td1 a');
            const title = link.attr('title') || link.text().trim();
            const href = link.attr('href');

            if (!href) return null;

            // 提取项目ID
            const projectId = this.extractProjectId(href);

            // 提取其他信息
            const cells = $(row).find('td');
            let publishDate = '';
            let endDate = '';

            if (cells.length >= 4) {
                publishDate = $(cells[2]).text().trim();
                endDate = $(cells[3]).text().trim();
            }

            // 规范化URL
            const detailUrl = this.normalizeUrl(href);

            return {
                projectId,
                title,
                category: '建设项目批前公示',
                publishDate,
                endDate,
                detailUrl,
                source: 'api',
                discoveredAt: new Date()
            };
        } catch (error) {
            logger.error('提取项目信息失败:', error.message);
            return null;
        }
    }

    /**
     * 方法2: 使用静态解析获取项目数据（备用方法）
     */
    async fetchProjectsByStaticParse() {
        try {
            logger.info('尝试静态解析获取项目数据...');

            const response = await this.safeRequest(CONFIG.LIST_URL);
            const html = response.data;

            // 保存HTML用于调试
            await fs.writeFile('./debug/static-page.html', html);

            // 直接解析HTML中的表格
            const $ = cheerio.load(html);
            const projects = [];

            // 查找项目行
            $('tr.DGtable_item').each((index, row) => {
                const project = this.extractProjectFromRow($, row);
                if (project) {
                    project.source = 'static';
                    projects.push(project);
                }
            });

            // 如果没有找到，尝试查找所有包含项目链接的行
            if (projects.length === 0) {
                logger.warn('未找到DGtable_item，尝试其他选择器...');

                $('tr').each((index, row) => {
                    const link = $(row).find('a[href*="/art/"]');
                    if (link.length) {
                        const href = link.attr('href');
                        const title = link.attr('title') || link.text().trim();

                        if (href && title) {
                            const projectId = this.extractProjectId(href);

                            projects.push({
                                projectId,
                                title,
                                detailUrl: this.normalizeUrl(href),
                                source: 'static-backup',
                                discoveredAt: new Date()
                            });
                        }
                    }
                });
            }

            logger.info(`静态解析获取到 ${projects.length} 个项目`);
            return projects;

        } catch (error) {
            logger.error('静态解析失败:', error.message);
            return [];
        }
    }

    /**
     * 提取项目ID
     */
    extractProjectId(url) {
        // 尝试匹配原始ID
        const match = url.match(/art_([a-f0-9]{32})\.html/);
        if (match) {
            return match[1];
        }

        // 如果匹配失败，生成稳定的哈希ID
        // 使用MD5哈希确保同一URL生成相同ID
        const hash = crypto.createHash('md5').update(url).digest('hex');
        return `hash_${hash}`;
    }

    /**
     * 规范化URL
     */
    normalizeUrl(url) {
        if (!url) return '';

        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        if (url.startsWith('//')) {
            return `https:${url}`;
        }

        if (url.startsWith('/')) {
            return `${this.baseUrl}${url}`;
        }

        return `${this.baseUrl}/${url}`;
    }

    /**
   * 获取项目详情
   */
    async fetchProjectDetail(project) {
        try {
            logger.info(`获取项目详情: ${project.title}`);

            const response = await this.safeRequest(project.detailUrl);
            const $ = cheerio.load(response.data);

            // 提取建设单位
            let constructionUnit = '';
            const buildUnitElement = $('#lblBuildUnit');
            if (buildUnitElement.length) {
                constructionUnit = buildUnitElement.text().trim();
            }

            // 提取图片
            const images = [];

            // 方法1: 查找a标签中的图片
            $('a[target="_Blank"]').each((index, element) => {
                const href = $(element).attr('href');
                if (href && this.isImageFile(href)) {
                    const imgElement = $(element).find('img');
                    const title = imgElement.attr('title') || $(element).attr('title') || '';

                    // 生成文件名
                    const filename = this.generateFilename(title, href, index);

                    images.push({
                        originalUrl: href,
                        title,
                        filename: filename
                    });
                }
            });

            // 方法2: 如果没有找到，查找所有img标签
            if (images.length === 0) {
                $('img').each((index, element) => {
                    const src = $(element).attr('src');
                    if (src && this.isImageFile(src)) {
                        const title = $(element).attr('title') || $(element).attr('alt') || '';

                        // 生成文件名
                        const filename = this.generateFilename(title, src, index);

                        images.push({
                            originalUrl: src,
                            title,
                            filename: filename
                        });
                    }
                });
            }

            logger.info(`找到 ${images.length} 张图片`);

            // 更新项目信息
            return {
                ...project,
                constructionUnit,
                images: images.map(img => ({
                    ...img,
                    url: this.normalizeUrl(img.originalUrl),
                    downloaded: false
                })),
                detailHtml: response.data.substring(0, 10000), // 保存部分HTML
                processedAt: new Date(),
                status: 'processed'
            };

        } catch (error) {
            logger.error(`获取项目详情失败 ${project.title}:`, error.message);
            return {
                ...project,
                images: [],
                status: 'failed',
                error: error.message,
                processedAt: new Date()
            };
        }
    }

    /**
     * 检查是否为图片文件
     */
    isImageFile(url) {
        const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        return extensions.some(ext => url.toLowerCase().includes(ext));
    }

    /**
     * 生成文件名
     */
    generateFilename(title, url, index) {
        let filename = '';

        if (title && title.trim() !== '') {
            // 使用标题作为文件名
            filename = title.replace(/[<>:"/\\|?*]/g, '_').trim();
        } else {
            // 从URL提取文件名
            const urlParts = url.split('/');
            filename = urlParts[urlParts.length - 1].split('?')[0];
        }

        // 确保有扩展名
        if (!filename.includes('.')) {
            const match = url.match(/\.(jpg|jpeg|png|gif|bmp|webp)/i);
            const ext = match ? match[1] : 'jpg';
            filename += `.${ext}`;
        }

        return `${index + 1}_${filename}`;
    }

    /**
   * 下载图片
   * 保存到: DOWNLOAD_DIR/项目名/filename
   */
    async downloadImage(image, projectTitle, projectId) {
        try {
            // 清理项目名称，用于文件夹命名
            const cleanProjectName = this.sanitizeFolderName(projectTitle);

            // 创建项目文件夹
            const projectDir = path.join(CONFIG.DOWNLOAD_DIR, cleanProjectName);
            await fs.ensureDir(projectDir);

            // 使用传入的filename作为文件名
            const filePath = path.join(projectDir, image.filename);

            logger.info(`下载图片: ${image.filename} 到 ${cleanProjectName}/`);

            // 检查是否已存在
            if (await fs.pathExists(filePath)) {
                const stats = await fs.stat(filePath);
                if (stats.size > 0) {
                    logger.info(`图片已存在: ${cleanProjectName}/${image.filename}`);
                    return {
                        success: true,
                        filePath,
                        skipped: true,
                        projectDir: cleanProjectName
                    };
                }
            }

            // 下载图片
            const response = await axios({
                url: image.url,
                method: 'GET',
                responseType: 'arraybuffer',
                headers: this.headers,
                timeout: 30000
            });

            // 保存文件
            await fs.writeFile(filePath, response.data);

            const stats = await fs.stat(filePath);
            logger.info(`下载成功: ${cleanProjectName}/${image.filename} (${Math.round(stats.size / 1024)}KB)`);

            return {
                success: true,
                filePath,
                size: stats.size,
                projectDir: cleanProjectName
            };

        } catch (error) {
            logger.error(`下载失败 ${image.filename}:`, error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * 清理文件夹名称，移除非法字符
     */
    sanitizeFolderName(folderName) {
        if (!folderName) return 'unnamed_project';

        // 移除非法字符，保留中文、字母、数字、空格、下划线、连字符
        let cleanName = folderName.replace(/[<>:"/\\|?*]/g, '');

        // 替换连续空格为单个下划线
        cleanName = cleanName.replace(/\s+/g, ' ').trim();

        // 限制长度
        if (cleanName.length > 100) {
            cleanName = cleanName.substring(0, 100);
        }

        // 如果清理后为空，使用默认名称
        if (!cleanName || cleanName.length === 0) {
            cleanName = 'unnamed_project';
        }

        return cleanName;
    }

    /**
     * 生成图片文件名
     * 使用原始标题或从URL提取
     */
    generateFilename(title, url, index) {
        let filename = '';

        if (title && title.trim() !== '') {
            // 使用标题作为文件名，移除非法字符
            filename = title.replace(/[<>:"/\\|?*]/g, '_').trim();
        } else {
            // 从URL提取文件名
            const urlParts = url.split('/');
            filename = urlParts[urlParts.length - 1].split('?')[0];
        }

        // 确保有扩展名
        if (!filename.includes('.')) {
            const match = url.match(/\.(jpg|jpeg|png|gif|bmp|webp)/i);
            const ext = match ? match[1] : 'jpg';
            filename += `.${ext}`;
        }

        return `${index + 1}_${filename}`;
    }


    /**
     * 检查项目是否已存在
     */
    async projectExists(projectId) {
        try {
            //   const collection = this.db.collection(CONFIG.COLLECTION_NAME);
            const count = await hangzhouPlanModel.countDocuments({ projectId });
            return count > 0;
        } catch (error) {
            logger.error('检查项目存在性失败:', error.message);
            return false;
        }
    }

    /**
     * 保存项目到数据库
     */
    async saveProjectToDB(project) {
        logger.info(`保存数据库：${JSON.stringify(project)}`);
        try {
            const result = await hangzhouPlanModel.updateOne(
                { projectId: project.projectId },
                {
                    $set: {
                        ...project,
                        lastUpdated: new Date()
                    }
                },
                { upsert: true }
            );

            logger.info(`项目已保存: ${project.title}`);
            return result;
        } catch (error) {
            logger.error(`保存项目失败 ${project.title}:`, error.message);
            throw error;
        }
    }

    /**
     * 主抓取流程
     */
    /**
   * 主抓取流程
   */
    async crawl() {
        logger.info('🚀 开始抓取杭州市建设项目批前公示');

        let projects = [];

        try {
            // 1. 连接数据库
            // await this.connectDB();

            // 2. 尝试获取项目列表
            if (CONFIG.USE_API_FIRST) {
                const apiProjects = await this.fetchProjectsByAPI();
                if (apiProjects && apiProjects.length > 0) {
                    projects = apiProjects;
                    logger.info(`API方法获取到 ${projects.length} 个项目`);
                } else {
                    logger.warn('API方法未获取到数据，尝试静态解析...');
                    projects = await this.fetchProjectsByStaticParse();
                }
            } else {
                projects = await this.fetchProjectsByStaticParse();
            }

            if (projects.length === 0) {
                logger.warn('未获取到任何项目数据');
                return { total: 0, processed: 0, skipped: 0, failed: 0 };
            }

            logger.info(`📊 共获取到 ${projects.length} 个项目`);

            // 3. 处理每个项目
            const results = {
                total: projects.length,
                processed: 0,
                skipped: 0,
                failed: 0,
                imagesDownloaded: 0,
                imagesFailed: 0,
                projectFolders: new Set() // 记录创建的项目文件夹
            };

            for (let i = 0; i < projects.length; i++) {
                const project = projects[i];

                // 进度显示
                const progress = Math.round(((i + 1) / projects.length) * 100);
                logger.info(`[${i + 1}/${projects.length}] ${progress}% 处理: ${project.title.substring(0, 30)}...`);

                try {
                    // 检查是否已存在
                    const exists = await this.projectExists(project.projectId);
                    if (exists) {
                        logger.info(`跳过已存在项目: ${project.title}`);
                        results.skipped++;
                        continue;
                    }

                    // 获取项目详情
                    const projectDetail = await this.fetchProjectDetail(project);

                    // 保存到数据库
                    await this.saveProjectToDB(projectDetail);
                    results.processed++;

                    // 下载图片
                    if (projectDetail.images && projectDetail.images.length > 0) {
                        const cleanProjectName = this.sanitizeFolderName(project.title);
                        results.projectFolders.add(cleanProjectName);

                        logger.info(`下载 ${projectDetail.images.length} 张图片到 ${cleanProjectName}/ 文件夹...`);

                        for (const image of projectDetail.images) {
                            const downloadResult = await this.downloadImage(image, project.title, project.projectId);

                            if (downloadResult.success && !downloadResult.skipped) {
                                results.imagesDownloaded++;
                            } else if (!downloadResult.success) {
                                results.imagesFailed++;
                            }

                            // 图片间延迟
                            await this.sleep(CONFIG.REQUEST_DELAY);
                        }
                    }

                    // 项目间延迟
                    await this.sleep(CONFIG.REQUEST_DELAY * 2);

                } catch (error) {
                    logger.error(`处理项目失败 ${project.title}:`, error.message);
                    results.failed++;
                }
            }

            // 4. 显示结果
            this.displayResults(results);

            return results;

        } catch (error) {
            logger.error('抓取过程发生错误:', error.message);
            throw error;
        } finally {
            // 5. 断开数据库连接
            await mongoose.disconnect();
            logger.info('抓取任务完成');
        }
    }

    /**
     * 显示结果
     */
    displayResults(results) {
        logger.info('\n' + '='.repeat(50));
        logger.info('抓取结果统计');
        logger.info('='.repeat(50));
        logger.info(`项目总数: ${results.total}`);
        logger.info(`新增处理: ${results.processed}`);
        logger.info(`跳过已存在: ${results.skipped}`);
        logger.info(`处理失败: ${results.failed}`);
        logger.info('-' + '-'.repeat(49));
        logger.info(`图片下载成功: ${results.imagesDownloaded}`);
        logger.info(`图片下载失败: ${results.imagesFailed}`);

        if (results.projectFolders && results.projectFolders.size > 0) {
            logger.info(`创建的项目文件夹: ${Array.from(results.projectFolders).join(', ')}`);
        }

        logger.info('='.repeat(50));
    }

    /**
     * 延迟函数
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * 主函数
 */
async function main() {
    try {
        logger.info('🏗️ 杭州市建设项目批前公示抓取系统');
        logger.info('='.repeat(50));

        // 创建抓取器实例
        // 根据您的情况选择使用哪个类

        // 方案1: 使用已有数据库模型（如果已定义）
        // const crawler = new CrawlerWithExistingModel();

        // 方案2: 使用纯MongoDB操作
        const crawler = new HybridProjectCrawler();

        // 运行抓取
        const results = await crawler.crawl();

        logger.info('🎉 抓取任务完成');

        // 根据结果决定退出码
        if (results.failed > results.total * 0.5) {
            // 超过一半失败，返回错误码
            process.exit(1);
        } else {
            process.exit(0);
        }

    } catch (error) {
        logger.error(` 主程序错误: ${error.message}`);

        if (error.stack) {
            logger.error('堆栈跟踪:', error.stack);
        }

        process.exit(1);
    }
}

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
    logger.error(` 未捕获异常: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error(' 未处理的Promise拒绝:', reason);
    process.exit(1);
});

// 处理退出信号
process.on('SIGINT', () => {
    logger.info('\n 收到SIGINT信号，正在优雅关闭...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    logger.info('\n 收到SIGTERM信号，正在优雅关闭...');
    process.exit(0);
});

// 运行主程序
if (require.main === module) {
    main();
}

// 导出模块
module.exports = {
    HybridProjectCrawler,
    main
};