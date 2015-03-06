
can.fixture({
	"GET /services/todos": function() {
		var todos = [
			{name: 'Walk the dog', completed: true, id: 0},
			{name: 'Mow the lawn', completed: false, id: 1},
			{name: 'Learn CanJS', completed: false, id: 2},
			{name: 'Take a shower', completed: true, id: 3}
		];
		return todos;
	},
	"DELETE /services/todos/{id}": function() {
		return {};
	},
	"POST /services/todos": function() {
		console.log("Todo created!");
		return {id: Math.random()};
	},
	"PUT /services/todos/{id}" : function() {
		console.log("Todo updated!");
		return {};
	}
});
// can.fixture.delay = 1000;

Todo = can.Model.extend({
	findAll: "GET /services/todos",
	destroy: "DELETE /services/todos/{id}",
	create:  "POST /services/todos",
	update:  "PUT /services/todos/{id}"
}, {});

Todo.List = Todo.List.extend({
	filter: function(check) {
		var list = new this.constructor
		this.each(function(todo) {
			if (check(todo)){
				list.push(todo)
			}
		})
		return list;
	},
	active: function() {
		return this.filter(function(todo) {
			return !todo.attr("completed")
		})
	},
	activeCount: function() {
		return this.active().attr('length')
	},
	completed: function() {
		return this.filter(function(todo) {
			return todo.attr("completed")
		})
	},
	completedCount: function() {
		return this.completed().attr('length')
	}
});

can.Component.extend({
	tag: "todos-create",
	template: '<input id="new-todo" placeholder="What needs to be done?" autofocus="" ' +
						'can-enter="createTodo" >',
	scope: {
		createTodo: function(context, element, event) {
			if (element.val()) {
				new Todo({
					completed: false,
					name: element.val()
				}).save();
				element.val("");
			}
		}
	}
});

can.Component.extend({
	tag: "todos-list",
	template: can.view("todos-list-template"),
	scope: {
		editTodo: function(todo, element, event) {
			todo.attr('editing', true);
		},
		updateTodo: function(todo, element, event) {
			todo.attr('editing', false);
			todo.attr('name', element.val());
			todo.save();
		}
	}
});

can.Component.extend({
	tag: "todos-app",
	scope: {
		todos: new Todo.List({}),
		displayedTodos: function() {
			var filter = can.route.attr('filter');
			var todos = this.attr('todos');

			if (filter === 'active') {
				return todos.active();
			}
			else if (filter === 'completed') {
				return todos.completed();
			}
			else {
				return todos;
			}
		},
		clearCompleted: function() {
			console.log("Clearing completed!");
			var todos = this.attr('todos');
			todos.each(function(todo, index) {
				if (todo.completed) {
					todo.destroy();
				}
			});
			console.log("Todos:", todos);
		}
	},
	helpers: {
		filterLink: function(linkText, filterValue) {
			var attrs = {};
			if (filterValue) {
				attrs.filter = filterValue;
			}

			return can.route.link(linkText, attrs, {
				className: can.route.attr("filter") === filterValue ? "selected" : ""
			})
		}
	},
	events: {
		"{Todo} created": function(Todo, event, newTodo) {
			this.scope.attr("todos").push(newTodo);
		}
	}
});

var frag = can.view("app-template", {});

$("#app").html( frag );

can.route("poopy_:filter");

can.route.ready();
