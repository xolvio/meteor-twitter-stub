var url = Npm.require('url');

HttpInterceptor = Package['xolvio:http-interceptor'].HttpInterceptor;

TwitterStub = TwitterStub || {};

Meteor.startup(function () {
  ServiceConfiguration.configurations.remove({});
  ServiceConfiguration.configurations.insert({
    service: 'twitter',
    consumerKey: 'long_consumer_key',
    secret: 'a_really_big_secret',
    //loginStyle: 'popup'
    loginStyle: 'redirect' //  easier when using webdriver as popup are an annoyance to deal with
  });
  TwitterStub.init();
});

OAuth = Package['oauth'].OAuth;

_.extend(TwitterStub, {

  fakeData: {

    oauthToken: 'C4fDpmAHHA7r0EZRBVJoIywoPMt64yMq',
    oauthVerifier: 'uE5YqPdfjh2hsMTR7L3MhDrEnzWKIRzE',
    oauthTokenSecret: 'Ct44BiqYSEt3vF2dBSkqVbviLIQMicIY',

    accessTokenOauthTokenSecret: 'K14oVfWunYuaqUPhEW6WkRkE7BKEAMO81qgh6tljrnIOb',
    accessTokenOauthToken: '859186075-8RvREJv57qylZWN6UD3HyFAFxkTS6RPmMHnBN7tm',

    user: {
      "id": 123456789,
      "id_str": "123456789",
      "name": "Fake User",
      "screen_name": "fake_user"
    }

  },

  init: function () {

    HttpInterceptor.registerInterceptor('https://api.twitter.com', Meteor.absoluteUrl('api.twitter.com'));

    var _state;
    var fakeServiceUrls = {
      requestToken: Meteor.absoluteUrl('api.twitter.com/oauth/request_token'),
      authorize: Meteor.absoluteUrl('api.twitter.com/oauth/authorize'),
      accessToken: Meteor.absoluteUrl('api.twitter.com/oauth/access_token'),
      authenticate: Meteor.absoluteUrl('api.twitter.com/oauth/authenticate')
    };

    var _requestHandlers = Package['oauth'].OAuth._requestHandlers['1'];
    Package['oauth'].OAuth._requestHandlers['1'] = function (service, query) {
      service.urls = fakeServiceUrls;
      _state = query.state;
      return _requestHandlers.apply(this, arguments);
    };

    Router.route('api.twitter.com/oauth/authenticate', function () {

      this.response.writeHead(302, {
        'Location': Meteor.absoluteUrl('_oauth/twitter') +
        '?state=' + _state +
        '&oauth_token=' + TwitterStub.fakeData.oauthToken +
        '&oauth_verifier=' + TwitterStub.fakeData.oauthVerifier
      });
      this.response.end();
    }, {where: 'server'});

    Router.route('api.twitter.com/oauth/request_token', function () {
      this.response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      this.response.end('oauth_token=' + TwitterStub.fakeData.oauthToken + '&oauth_token_secret=' + TwitterStub.fakeData.oauthTokenSecret + '&oauth_callback_confirmed=true');
    }, {where: 'server'});

    Router.route('api.twitter.com/oauth/access_token', function () {
      this.response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      this.response.end('oauth_token=' + TwitterStub.fakeData.accessTokenOauthToken + '&oauth_token_secret=' + TwitterStub.fakeData.accessTokenOauthTokenSecret + '&user_id=' + TwitterStub.fakeData.user.id + '&screen_name=' + TwitterStub.fakeData.user.screen_name);
    }, {where: 'server'});

    Router.route('api.twitter.com/1.1/account/verify_credentials.json', function () {
      this.response.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});
      this.response.end(JSON.stringify(TwitterStub.fakeData.user));
    }, {where: 'server'});

  }

});

