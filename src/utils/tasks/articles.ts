import axios from 'axios';
import {Article} from '../../mongo/models/articles';
import { notify } from '.';
import { FetchedArticle } from '../../constants/types';


// Constants
const DUPLICATE_KEY_ERROR_CODE = 11000;

async function getArticles(q: string) {
  if(!q){
    throw new Error('MISSING_QUERY_ERROR: Missing query. A query is required to find articles.')
  }
  try {
    const url = `https://newsdata.io/api/1/news?apikey=${process.env.NEWS_API}&q=${q}&language=en&country=gb,us,ru,cn&category=top,technology,science,business`;
    const response = await axios.get(url);
    const articles = response.data?.results;
    return articles;
  } catch (error: any) {
    console.error("Error in getArticles: ", error.message);
  }
}

async function store(articlesToInsert: FetchedArticle[]) {
  let results: any[] = [];
  let addedArticlesCount = 0;
  try {
    results = await Article.insertMany(articlesToInsert, { ordered: false });
    addedArticlesCount = results.length;
  } catch (error) {
    handleInsertionError(error, addedArticlesCount);
  } finally {
    if (addedArticlesCount > 0) {
      await notify.all({message:`${addedArticlesCount} articles inserted successfully:\n${formatArticlesForTelegram(results)}`});
    }
  }
}

function handleInsertionError(error: any, addedArticlesCount: number) {
  if (error.code === DUPLICATE_KEY_ERROR_CODE) {
    console.warn(`Added ${addedArticlesCount} articles. ${error.writeErrors.length} duplicates were skipped.`);
  } else {
    console.error('Error during insertion:', error);
  }
}

function formatArticlesForTelegram(articles: FetchedArticle[]) {
  return articles.map((article) => {
    return `Title: ${article.title}\nURL: ${article.url}\n`;
  }).join('\n');
}


async function findArticlesTask({q}: {q: string}){
  try{
    const articles = await getArticles(q);
    if(articles?.length > 0){
      await store(articles)
    }
  }catch(error){
    console.error(error)
  }
}

export {findArticlesTask};
