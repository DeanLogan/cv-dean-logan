import { request } from 'https';

export async function handler(event, context) {
    const token = process.env.GITHUB_TOKEN;
    const username = 'DeanLogan';

    const lastMonthContributions = await contributionsLastMonth(username, token);
    const lastYearContributions = await contributionsLastYear(username, token);

    return {
        statusCode: 200,
        body: JSON.stringify({
            lastMonthContributions,
            lastYearContributions
        })
    };
}

function contributionsLastYear(username, token) {
    var query = `
    query($userName:String!) { 
        user(login: $userName){
            contributionsCollection {
            contributionCalendar {
                totalContributions
                weeks {
                contributionDays {
                    contributionCount
                    date
                }
                }
            }
            }
        }
    }`;

    return new Promise((resolve, reject) => {
        const req = request('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data).data.user.contributionsCollection.contributionCalendar.totalContributions));
        });

        req.on('error', reject);
        req.write(JSON.stringify({
            query: query,
            variables: {userName: username}
        }));
        req.end();
    });
}

function contributionsLastMonth(username, token) {
    var to = new Date();
    var year  = to.getFullYear();
    var month = to.getMonth();
    var day   = to.getDate();
    var from = new Date(year, month - 1, day);

    var query = `
    query ContributionsView($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
                totalCommitContributions
                totalIssueContributions
                totalPullRequestContributions
                totalPullRequestReviewContributions
                restrictedContributionsCount
            }
        }
    }`;

    var variables = {
        username: username,
        from: from.toISOString(),
        to: to.toISOString()
    };

    return new Promise((resolve, reject) => {
        const req = request('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const contributions = JSON.parse(data).data.user.contributionsCollection;
                resolve(contributions.totalCommitContributions +
                        contributions.totalIssueContributions +
                        contributions.totalPullRequestContributions +
                        contributions.totalPullRequestReviewContributions +
                        contributions.restrictedContributionsCount);
            });
        });

        req.on('error', reject);
        req.write(JSON.stringify({
            query: query,
            variables: variables
        }));
        req.end();
    });
}