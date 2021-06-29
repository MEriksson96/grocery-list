import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Todo } from './Todo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Shoppinglista';
  newItem: string = "";
  shoppingListForm: FormGroup;
  todoList: Array<Todo> = [];
  errorMessage: string = "";
  duplicateItemsMessage: string = "";

  constructor(private formBuilder: FormBuilder) {
    this.shoppingListForm = formBuilder.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getTodos();
  }

  getTodos() {
    const storedItems = JSON.parse(localStorage.getItem('dataSource'));
    let items = storedItems === null ? [] : storedItems;
    this.todoList = items;
    return this.todoList;
  }

  addNewItem() {
    let item = this.shoppingListForm.get("name").value;
    if (item === "" || item === null || item === undefined) {
      this.errorMessage = "Fältet får inte vara tomt";
      setTimeout(() => {
        this.errorMessage = "";
      }, 1000);
      return;
    }

    let storedItems = this.getTodos();
    let duplicate = storedItems.some(x => x.name === item);

    if (duplicate) {
      this.duplicateItemsMessage = "Varan finns redan i listan";
      setTimeout(() => {
        this.duplicateItemsMessage = "";
      }, 1000);
      return;
    }

    let newTodo: Todo = {
      name: item,
      isCompleted: false,
      numberOfItems: 1
    };
    storedItems.push(newTodo);
    // this.todoList.push(newTodo);
    localStorage.setItem('dataSource', JSON.stringify(storedItems));
    this.getTodos();
    setTimeout(() => {
      this.shoppingListForm.reset();
    }, 1000);
  }

  markAsComplete(name: string) {
    let todos = this.getTodos();
    let todo = todos.find(x => x.name === name);
    todo.isCompleted = !todo.isCompleted;
    localStorage.setItem('dataSource', JSON.stringify(todos));
  }

  increase(item: Todo) {
    let todos = this.getTodos();
    let todo = todos.find(x => x.name === item.name);
    todo.numberOfItems++;
    localStorage.setItem('dataSource', JSON.stringify(todos));
  }

  decrease(item: Todo) {
    if (item.numberOfItems < 1) {
      return;
    }
    let todos = this.getTodos();
    let todo = todos.find(x => x.name == item.name);
    todo.numberOfItems--;
    localStorage.setItem('dataSource', JSON.stringify(todos));
  }

  removeGroceryList() {
    localStorage.removeItem("dataSource");
    this.getTodos();
  }

}
