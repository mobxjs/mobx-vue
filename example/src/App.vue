<script lang="tsx">

  import { inject } from "mmlpx";
  import { action, observable } from "mobx";
  import { types } from "mobx-state-tree";
  import { Observer } from "mobx-vue";
  import Vue from "vue";
  import { Component, Prop } from "vue-property-decorator";
  import {default as com} from './Component';

  const Todo = types
    .model("Todo", {
      count: types.number,
    })
    .actions(self => {
      return {
        increase() {
          self.count++;
        },
      };
    });

  const todo = Todo.create({ count: 0 });

  class Model {
    @observable age = 10;

    @action.bound
    setAge() {
      this.age++;
    }
  }

  console.log(observable.box(1));

  const om = observable.object({ msg: "xxx" });
  const model = new Model();

  setTimeout(() => model.setAge(), 3000);

  @Observer
  @Component({
    components: {
      com
    }
  })
  export default class App extends Vue {

    @inject()
    model: Model;

    todo = todo;

    om = om;

    name = "kuitos";
    show = false;

    @Prop() msg!: string;

    increase() {
      this.todo.increase();
    }

    beforeCreate() {
      console.log("beforeCreate", this.model);
    }

    created() {
      console.log("created", this.model.age);
    }

    mounted() {
      console.log('kui rxxx bs')
    }

    toggle() {
      this.show = !this.show;
    }

    render(h: any) {
      console.log(this);
      return (
        <div>
          <button onClick={this.model.setAge}>click me</button>
          <button onClick={this.toggle}>toggle</button>
          <button onClick={this.increase}>increase todo</button>
          <span>{this.todo.count}</span>
          {
            this.show ? <div>
              {this.model.age} {this.om.msg}
            </div> : null
          }
          <com name={this.model.age}></com>
        </div>

      );
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
