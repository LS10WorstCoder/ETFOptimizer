import axios from 'axios';

const systemContext = `Keep the following CSV files on hand as all of them are required for you
                        to perform analysis on the users portfolio when they upload them I need
                        you to use these etf overviews to optimize a users ETF investment portfolo
                        using the best ETF from the 5 categories that the user selects. You will
                        have to match those 5 selected categories to the csv's you have given to
                        you in this message, make sure you pick the best possible etfs out of the
                        selected categories and detail how much earning potential and return precentages
                        the user can get out of upgrading top your investment plan. Also detail how much
                        better your investement plan is compared to the users current portfolio by comparing financial numbers.
                        Here are 30 CSV's one for every category:
                        
                        `

export const send = async (message) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-4o",
                messages: [
                    {role : 'system', content: systemContext},
                    { role: 'user', content:
                    ` ${message}` }
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error communicating with ChatGPT:', error);
        throw error;
    }
};