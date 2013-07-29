define(["services/configs_base", "backbone"], function(ConfigsBase) {

  var base = new ConfigsBase();
  var module = {};

  module.listenedAccounts = function() {
    return base.get("listenedAccounts") || {};
  };

  module.isListened = function(accountId) {
    return _.has(this.listenedAccounts(), accountId);
  };

  module.toggle = function(account) {
    var listenedAccounts = this.listenedAccounts();

    if (this.isListened(account.id)) {
      delete listenedAccounts[account.id];
    } else {
      listenedAccounts[account.id] = account;
    }

    base.set("listenedAccounts", listenedAccounts);
  };

  return module;
});