describe("Class", function() {
	
	describe("#extend", function() {
		var Klass,
			constructor,
			method;
		
		beforeEach(function() {
			constructor = jasmine.createSpy("Klass constructor");
			method = jasmine.createSpy("Klass#bar method");

			Klass = L.Class.extend({
				statics: {bla: 1},
				includes: {mixin: true},
				
				initialize: constructor,
				foo: 5,
				bar: method
			});
		});
		
		it("should create a class with the given constructor & properties", function() {
			var a = new Klass();
			
			expect(constructor).toHaveBeenCalled();
			expect(a.foo).toEqual(5);
			
			a.bar();
			
			expect(method).toHaveBeenCalled();
		});
		
		it("should inherit parent classes' constructor & properties", function() {
			var Klass2 = Klass.extend({baz: 2});
			
			var b = new Klass2();
			
			expect(b instanceof Klass).toBeTruthy();
			expect(b instanceof Klass2).toBeTruthy();
			
			expect(constructor).toHaveBeenCalled();
			expect(b.baz).toEqual(2);
			
			b.bar();
			
			expect(method).toHaveBeenCalled();
		});
		
		it("should grant the ability to call parent methods, including constructor", function() {
			var Klass2 = Klass.extend({
				initialize: function() {},
				bar: function() {}
			});
			
			var b = new Klass2();
			
			expect(constructor).not.toHaveBeenCalled();
			b.constructor.superclass.initialize.call(this);
			expect(constructor).toHaveBeenCalled();

			b.constructor.superclass.bar.call(this);
			expect(method).toHaveBeenCalled();
		});
		
		it("should support static properties", function() {
			expect(Klass.bla).toEqual(1);
		});
		
		it("should inherit parent static properties", function() {
			var Klass2 = Klass.extend({});
			
			expect(Klass2.bla).toEqual(1);
		});
		
		it("should override parent static properties", function() {
			var Klass2 = Klass.extend({statics: {bla: 2}});
			
			expect(Klass2.bla).toEqual(2);
		});
		
		it("should include the given mixin", function() {
			var a = new Klass();
			expect(a.mixin).toBeTruthy();
		});
		
		it("should be able to include multiple mixins", function() {
			var Klass2 = L.Class.extend({
				includes: [{mixin: true}, {mixin2: true}]
			});
			var a = new Klass2();
			
			expect(a.mixin).toBeTruthy();
			expect(a.mixin2).toBeTruthy();
		});
		
		it("should grant the ability to include the given mixin", function() {
			Klass.include({mixin2: true});
			
			var a = new Klass();
			expect(a.mixin2).toBeTruthy();
		});
		
		it("should merge options instead of replacing them", function() {
			var KlassWithOptions1 = L.Class.extend({
				options: {
					foo1: 1,
					foo2: 2
				}
			});
			var KlassWithOptions2 = KlassWithOptions1.extend({
				options: {
					foo2: 3,
					foo3: 4
				}
			});
			
			var a = new KlassWithOptions2();
			
			expect(a.options).toEqual({
				foo1: 1,
				foo2: 3,
				foo3: 4
			});
		});
		
		it("should have working superclass access with inheritance level > 2", function() {
			var constructor2 = jasmine.createSpy("Klass2 constructor"),
				constructor3 = jasmine.createSpy("Klass3 constructor");
			
			var Klass2 = Klass.extend({
				initialize: function() {
					constructor2();
					expect(Klass2.superclass).toBe(Klass.prototype);
					Klass2.superclass.initialize.apply(this, arguments);
				}
			});
			
			var Klass3 = Klass2.extend({
				initialize: function() {
					constructor3();
					expect(Klass3.superclass).toBe(Klass2.prototype);
					Klass3.superclass.initialize.apply(this, arguments);
				}
			});
			
			var a = new Klass3();
			
			expect(constructor3).toHaveBeenCalled();
			expect(constructor2).toHaveBeenCalled();
			expect(constructor).toHaveBeenCalled();
		});
	});
});