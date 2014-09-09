Template.users.users = function () {
  return Meteor.users.find();
};

Template.login.isLoggedIn = function () {
  return Meteor.userId();
};

Template.login.accounts = function () {
  return Meteor.user().profile.accounts;
};

Template.login.events({
  'submit #login-form': function(e, t) {
    e.preventDefault();
    
    // retrieve the input field values
    var email = t.find('#login-email').value
    , password = t.find('#login-password').value;

    Meteor.loginWithPassword(email, password, function(err) {
      if (err)
        alert(err);
    });
    
    // Prevent form submission
    return false; 
  },
  
  'submit #registration-form': function(e, t) {
    e.preventDefault();
    
    // retrieve the input field values
    var email = t.find('#registration-email').value
    , password = t.find('#registration-password').value
    , username = t.find('#registration-name').value;

    Accounts.createUser({ username: username, email: email, password: password }, function(err) {
      if (err)
        alert(err);
    });
    
    // Prevent form submission
    return false; 
  },
  
  'submit #account-form': function(e, t) {
    e.preventDefault();
    
    // retrieve the input field values
    var accountName = t.find('#account-name').value
    , accountAddress = t.find('#account-address').value;

    var profile = Meteor.user().profile || { accounts: [] };
    var accounts = profile.accounts;
    accounts.push({ name: accountName, address: accountAddress });

    Meteor.users.update({ _id: Meteor.userId() }, { $set: { profile: { accounts: accounts } } }, function(err) {
      if (err)
        alert(err);
    });
    
    // Prevent form submission
    return false; 
  },
  
  'click .logout': function (e, t) {
    Meteor.logout();
  },
  
  'click .remove-account': function (e, t) {
    var unwantedAccount = this;
    var accounts = Meteor.user().profile.accounts;
    
    var accountsLeft = _.filter(accounts, function (account) {
      return account.name != unwantedAccount.name && account.address != unwantedAccount.address;
    });
    
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { profile: { accounts: accountsLeft } } });
  }
});