if (Meteor.isClient) {

	Router.map(function() {
		this.route('users');

    this.route('usersSearch', {
      template: 'users',
      path: '/users/search/:tags',
      onBeforeAction: function() {
      	Session.set('userTagFilter', this.params.tags.split(','));
      }
    });
	});

	Session.setDefault('userTagFilter', []);
	Template.users.helpers({

		users: function() {

			var query = {};
			var userTagFilter = Session.get('userTagFilter');
			if (userTagFilter.length)
				query['profile.tags'] = { $all: userTagFilter }

			return Meteor.users.find(query, {
				sort: { 'profile.name': 1 }
			});
		},

		userTagFilter: function() {
			return Session.get('userTagFilter').join(',');
		}

	});

	Template.users.rendered = function() {

    this.$('input').select2({
      width: '350px',
      tags: function() {
        return tagCache;
      },
      initSelection : function (element, callback) {
        var data = [];
        $(element.val().split(",")).each(function () {
            data.push({id: this, text: this});
        });
        callback(data);
      },
      tokenSeparators: [",", " "],
    }).on('change', function(event) {
    	Session.set('userTagFilter', event.val);
    });

	}

	Template.user.events({

		'click .serviceLinks a': function(event, tpl) {
			event.stopPropagation();
		}

	});

	Template.user.helpers({

		inFilter: function() {
			return _.contains(Session.get('userTagFilter'), this.valueOf());
		}

	});
}