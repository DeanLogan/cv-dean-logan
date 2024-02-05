const fetch = require('node-fetch');

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

// Gets the contribution number for the last year, the number that shows above the contribution graph on github
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
    
    return fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: query,
            variables: {userName: username}
        }),
    })
    .then(response => response.json())
    .then(data => {
        return data.data.user.contributionsCollection.contributionCalendar.totalContributions;
    });
}

// Gets the total contributions over the last month by adding up all the contribution stats (does not include repos created)
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

    return fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            query: query,
            variables: variables
        }),
    })
    .then(response => response.json())
    .then(data => {
        const contributions = data.data.user.contributionsCollection;
        return contributions.totalCommitContributions +
                contributions.totalIssueContributions +
                contributions.totalPullRequestContributions +
                contributions.totalPullRequestReviewContributions +
                contributions.restrictedContributionsCount;
    });
}