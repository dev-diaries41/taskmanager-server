# Task manager server

## Table of Contents
1. [Introduction](#overview)
2. [How to Install](#how-to-install)
3. [How to Use](#how-to-use)
4. [Additional Info](#additional-info)


## Overview
<a name="overview"></a>

This is a dedicated task management server built using Express.js and Bullmq. It relies on an existing redis connection. If you do not have a redis server running locally or in the cloud it will not work. The repository provides to default tasks: notify and articles, for sending notifications via telegram and discord and fetching articles based on a query. All tasks can be scheduled or executed instantly.

## How to Install
<a name="how-to-install"></a>

To install the taskmanager server , follow these installation steps:

**Clone repo:**
Enter the following command in your terminal.

```bash
git clone https://github.com/dev-diaries41/taskmanager-server.git
```

Change into the cloned repository directory:

```bash
cd taskmanager-server
```

Install the required dependencies using npm:
  
```bash
npm install
```

## How to Use
<a name="how-to-use"></a>

### Environment variables:

Make sure to include the following environment variables below which are needed for the Notify class to function properly. The MongoDB Url is required so that the articles you find can be stored in  your MongoDB and also for the middleware to run. Please read the Additonal Info section for more on how the MongoDB url is used for the middleware. You can get your telegram bot token from the Bot Father telegram channel. You can get you discord webhook from within discord. You can get your NEWS_API key at [newsdata.io](https://newsdata.io/).

```
NEWS_API=your_news_api_key
MONGODB_URL=your_mongodb_url
PORT=your_port_number

#TELEGRAM CONFIG
TELEGRAM_CHANNEL_ID=your_telegram_channel_id
TELEGRAM_BOT_TOKEN=your_telegram_bot_token

#DISCORD CONFIG
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

Start the server using the following commands:

```bash
npm start 
```

### Available endpoints:

The endpoints below are available to use.

```javascript
'/api/v1/task/notify'
'/api/v1/task/articles'
```

### Examples

See the examples below:

```typescript
import axios from 'axios'; 

const notfiyTaskUrl = 'http://localhost:3000/api/v1/task/notify';
const articlesTaskUrl = 'http://localhost:3000/api/v1/task/articles';


async function startNotifyTask(){
    try{
        const notifyTaskParams = {
            taskName:'notify', // execute the notify task
            taskParams:{message:'this is the updated task using bullmq instant'}, // notify params
            when: Date.now() +  (1000 * 60 * 60)  // schedule for 1hour away
        }

        const reqBody = notifyTaskParams; 
           
        const response= await axios.post(startTaskUrl, reqBody);
        return response.data;


    }catch(error){
        console.error('Error in startNotifyTask: ', error.response.data.error)
        return error.response.data.error;
    }
}


async function startArticlesTask(){
    try{
        const articlesTaskParams = {
            taskName:'articles', // execute the articles task
            taskParams:{q:'ai'}, // articles params - search for ai articles
            when: Date.now()  // run instantly (assuming other tasks are not in the queue)
        }
        const reqBody = articlesTaskParams; 
           
        const response= await axios.post(startTaskUrl, reqBody);
        return response.data;


    }catch(error){
        console.error('Error in startArticlesTask: ', error.response.data.error)
        return error.response.data.error;
    }
}
```

## Additional Info
<a name="additional-info"></a>

**API Key:**

 The server uses authentication middleware, which verifies a valid API key for all routes. The implementation for this is not included in this repistory, therefore, for simplicity, the authenticate middleware has been commented out in the `src/index.ts` file.