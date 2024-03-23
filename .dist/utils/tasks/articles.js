"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findArticlesTask = void 0;
const axios_1 = __importDefault(require("axios"));
const articles_1 = require("../../mongo/models/articles");
const _1 = require(".");
// Constants
const DUPLICATE_KEY_ERROR_CODE = 11000;
async function getArticles(q) {
    if (!q) {
        throw new Error('MISSING_QUERY_ERROR: Missing query. A query is required to find articles.');
    }
    try {
        const url = `https://newsdata.io/api/1/news?apikey=${process.env.NEWS_API}&q=${q}&language=en&country=gb,us,ru,cn&category=top,technology,science,business`;
        const response = await axios_1.default.get(url);
        const articles = response.data?.results;
        return articles;
    }
    catch (error) {
        console.error("Error in getArticles: ", error.message);
    }
}
async function store(articlesToInsert) {
    let results = [];
    let addedArticlesCount = 0;
    try {
        results = await articles_1.Article.insertMany(articlesToInsert, { ordered: false });
        addedArticlesCount = results.length;
    }
    catch (error) {
        handleInsertionError(error, addedArticlesCount);
    }
    finally {
        if (addedArticlesCount > 0) {
            await _1.notify.all({ message: `${addedArticlesCount} articles inserted successfully:\n${formatArticlesForTelegram(results)}` });
        }
    }
}
function handleInsertionError(error, addedArticlesCount) {
    if (error.code === DUPLICATE_KEY_ERROR_CODE) {
        console.warn(`Added ${addedArticlesCount} articles. ${error.writeErrors.length} duplicates were skipped.`);
    }
    else {
        console.error('Error during insertion:', error);
    }
}
function formatArticlesForTelegram(articles) {
    return articles.map((article) => {
        return `Title: ${article.title}\nURL: ${article.url}\n`;
    }).join('\n');
}
async function findArticlesTask({ q }) {
    try {
        const articles = await getArticles(q);
        if (articles?.length > 0) {
            await store(articles);
        }
    }
    catch (error) {
        console.error(error);
    }
}
exports.findArticlesTask = findArticlesTask;
