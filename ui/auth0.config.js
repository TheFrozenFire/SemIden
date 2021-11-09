module.exports = {
  client: {
    domain: 'dev-9h47ajc9.us.auth0.com',
    client_id: 'T15e646b4uhAryyoj4GNRon6zs4MrHFV'
  },
  supported_connections: [
    "apple",
    "bitbucket",
    "discord",
    "facebook",
    "github",
    "google-oauth2",
    "linkedin",
    "twitter",
    "windowslive",
    "wordpress",
  ],
  // https://auth0.com/docs/connections/social
  // console.log(JSON.stringify(Array.from(connectionElements.values()).map((element) => { return { name: element.href.split('/').pop(), title: element.querySelector('.connection-title').innerHTML, image: element.querySelector('img').src } }), null, 2));
  // Requires some massaging
  connections: [
    {
      "name": "amazon",
      "title": "Amazon Web Services",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/amazon.png"
    },
    {
      "name": "apple",
      "title": "Apple",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/apple.png"
    },
    {
      "name": "baidu",
      "title": "Baidu",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/baidu.png"
    },
    {
      "name": "basecamp",
      "title": "Basecamp",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/basecamp.png"
    },
    {
      "name": "bitbucket",
      "title": "Bitbucket",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/bitbucket.png"
    },
    {
      "name": "box",
      "title": "Box",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/box.png"
    },
    {
      "name": "clever",
      "title": "Clever",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/clever.png"
    },
    {
      "name": "digitalocean",
      "title": "DigitalOcean",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/digitalocean.png"
    },
    {
      "name": "discord",
      "title": "Discord",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/discord.png"
    },
    {
      "name": "docomo",
      "title": "Docomo",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/daccount.png"
    },
    {
      "name": "dribbble",
      "title": "Dribbble",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/dribbble.png"
    },
    {
      "name": "dropbox",
      "title": "Dropbox",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/dropbox.png"
    },
    {
      "name": "dwolla",
      "title": "Dwolla",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/dwolla.png"
    },
    {
      "name": "evernote-sandbox",
      "title": "Evernote Sandbox",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/evernote.png"
    },
    {
      "name": "evernote",
      "title": "Evernote",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/evernote.png"
    },
    {
      "name": "exact",
      "title": "Exact",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/exact.png"
    },
    {
      "name": "facebook",
      "title": "Facebook",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/facebook.png"
    },
    {
      "name": "figma",
      "title": "Figma",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/figma.png"
    },
    {
      "name": "fitbit",
      "title": "Fitbit",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/fitbit.png"
    },
    {
      "name": "github",
      "title": "Github",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/github.png"
    },
    {
      "name": "google-oauth2",
      "title": "Google",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/google.png"
    },
    {
      "name": "imgur",
      "title": "Imgur",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/imgur.png"
    },
    {
      "name": "line",
      "title": "LINE",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/line.png"
    },
    {
      "name": "linkedin",
      "title": "LinkedIn",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/linkedin.png"
    },
    {
      "name": "microsoft-account",
      "title": "Microsoft Account",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/ms.png"
    },
    {
      "name": "oauth2",
      "title": "OAuth2 Provider (Generic)",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/oauth2.png"
    },
    {
      "name": "paypal-sandbox",
      "title": "PayPal Sandbox",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/paypal.png"
    },
    {
      "name": "paypal",
      "title": "PayPal",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/paypal.png"
    },
    {
      "name": "planning-center",
      "title": "Planning Center",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/planning-center.png"
    },
    {
      "name": "quickbooks-online",
      "title": "QuickBooks Online",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/quickbooks.png"
    },
    {
      "name": "renren",
      "title": "RenRen",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/renren.png"
    },
    {
      "name": "salesforce-community",
      "title": "Salesforce Community",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/salesforce.png"
    },
    {
      "name": "salesforce-sandbox",
      "title": "Salesforce Sandbox",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/salesforce.png"
    },
    {
      "name": "salesforce",
      "title": "Salesforce",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/salesforce.png"
    },
    {
      "name": "shopify",
      "title": "Shopify",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/shopify.png"
    },
    {
      "name": "slack",
      "title": "Slack",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/slack.png"
    },
    {
      "name": "spotify",
      "title": "Spotify",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/spotify.png"
    },
    {
      "name": "stripe-connect",
      "title": "Stripe Connect",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/stripe.png"
    },
    {
      "name": "twitch",
      "title": "Twitch",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/twitch.png"
    },
    {
      "name": "twitter",
      "title": "Twitter",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/twitter.png"
    },
    {
      "name": "vimeo",
      "title": "Vimeo",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/vimeo.png"
    },
    {
      "name": "vkontakte",
      "title": "vKontakte",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/vkontakte.png"
    },
    {
      "name": "weibo",
      "title": "Weibo",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/weibo.png"
    },
    {
      "name": "wordpress",
      "title": "WordPress",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/wordpress.png"
    },
    {
      "name": "yahoo",
      "title": "Yahoo!",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/yahoo.png"
    },
    {
      "name": "yammer",
      "title": "Yammer",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/yammer.png"
    },
    {
      "name": "yandex",
      "title": "Yandex",
      "image": "https://cdn2.auth0.com/docs/1.12199.0/media/connections/yandex.png"
    }
  ]
}
