Twitter Stub
============

This package was developed for [Respond.ly](Respond.ly) by [Xolv.io](Xolv.io). Special thanks to the
kind Respond.ly team for allowing us to release what they sponsored to the Open Source community.

#Get the Book
To learn more about testing with Meteor, consider purchasing our book [The Meteor Testing Manual](http://www.meteortesting.com/?utm_source=twitter-stub&utm_medium=banner&utm_campaign=twitter-stub).

[![](http://www.meteortesting.com/img/tmtm.gif)](http://www.meteortesting.com/?utm_source=twitter-stub&utm_medium=banner&utm_campaign=twitter-stub)

Your support helps us continue our work on Velocity and related frameworks.


##What is it?
A stub for use in testing Meteor apps. Stubs the oauth calls and allows you to fake stub more.

##Usage:

If you are using Twitter authentication, add this package like this:

`meteor add xolvio:twitter-stub`

Your app will no longer authenticate with Twitter in development mode and will authenticate with
a fake user even if you do not have an internet connection. This package does not affect production
as it is a `debugOnly` package.

This package is an example of how to use
[xolvio:http-interceptor](https://github.com/xolvio/meteor-http-interceptor) to test your app.

If you want to get more control over the user that is returned, you can set the user in the fakeData
object that the stub uses like this:

```javascript
TwitterStub.fakeData.user = {
  "id": 123456789,
  "id_str": "123456789",
  "name": "Fake User",
  "screen_name": "fake_user"
  // put anything you like here
}
```

