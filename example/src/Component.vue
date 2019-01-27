<script lang="tsx">


  import { observable } from "mobx";
  import { observer } from "mobx-vue";

  class Store {
    @observable
    name: string;
  }

  export default observer({
    name: "com",
    props: {
      name: Number,
    },
    data() {
      return { state: new Store() };
    },
    beforeUpdate() {
      console.log(this.name);
      this.state.name = this.name;
    },
    render(this: any, h: any) {
      console.log(this);
      return (
        <div>
          <p>{this.state.name}</p>
        </div>
      );
    },
  });
</script>

<style scoped>

</style>
