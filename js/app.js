
can.fixture("GET /services/todos", function() {
	var todos = [
		{name: 'Walk the dog', completed: true, id: 0},
		{name: 'Mow the lawn', completed: false, id: 1},
		{name: 'Learn CanJS', completed: false, id: 2},
		{name: 'Take a shower', completed: true, id: 3}
	];
	return todos;
});
// can.fixture.delay = 1000;

can.fixture("DELETE /services/todos/{id}", function() {
	return {};
});

Todo = can.Model.extend({
	findAll: "GET /services/todos",
	destroy: "DELETE /services/todos/{id}"
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
	}
});

var todos = new Todo.List({});

var frag = can.view("app-template", {
	todos: todos
});

$("#app").html( frag );
