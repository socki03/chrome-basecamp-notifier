define([
  "models/user_token",
  "collections/accounts",
  "backbone",
  "backbone.deferred"
], function(
  UserToken,
  Accounts
) {
  return Backbone.DeferredModel.extend({
    url: function() {
      return "https://launchpad.37signals.com/authorization.json";
    },

    partialFullName: function() {
      var identity = this.get("identity");
      return identity.first_name + " " + identity.last_name[0] + ".";
    },

    getAccounts: function () {
      if (this.accounts == undefined) {
        this.accounts = new Accounts(this.get("accounts"));
      }

      return this.accounts;
    },

    fullName: function() {
      var identity = this.get("identity");
      return identity.first_name + " " + identity.last_name;
    },

    cacheUser: function() {
      localStorage.setItem("currentUser", JSON.stringify(this.toJSON()));
    }
  }, {
    fetchCurrentUser: function() {
      var user = new this();
      var userPromise = user.fetch({
        beforeSend: function(xhr) {
          xhr.setRequestHeader('Authorization', ("Bearer " + UserToken.current()));
        }
      });

      userPromise.done(function(model){
        user.cacheUser();
      });

      return userPromise;
    },

    current: function() {
      if(chrome.extension.getBackgroundPage().currentUser == undefined) {
        var cachedUser = JSON.parse(localStorage.getItem("currentUser"));
        var user = new this(cachedUser);

        chrome.extension.getBackgroundPage().currentUser = user;
      } else {
        var user = chrome.extension.getBackgroundPage().currentUser;
      }

      return user;
    }
  });
});
