new Vue({
  el: '#editor',
  data: {
    input: '# hello',
    cur_file: '',
    cur_title: 'test',
    titles: [{title: "need", id: 1}, {title: "refresh", id: 2}, {title:"faster", id: 3}]
  },
  computed: {
    compiledMarkdown: function () {
      return marked(this.input, { sanitize: true })
    }
  },
  methods: {
    find_id: function(cur_file){
      for (let i = 0; i < this.titles.length; i++){
        if (this.titles[i].title == cur_file) {
          return this.titles[i]._id;
        }
      }
    },
    update_m: function (e) {
      this.input = e.target.value
    },
    save: function(){
      //this.$http.put("localhost:8080/files");
    },
    del: function(){
      let id = this.find_id(this.cur_file);
      this.$http.delete("http://localhost:8080/files/" + id).then(response =>{
        console.log("Delete success");
      });
    }, 
    select: function(){
      let id = this.find_id(this.cur_file);
      this.$http.get("http://localhost:8080/files/" + id).then(response =>{
        let res = Object.values(response.body);
        this.input = res[2];
        this.cur_title = res[1];
      });
    },
    refresh: function(){
      this.$http.get("http://localhost:8080/files").then(response => {
        let res = Object.values(response.body);
        this.titles.length = res.length;
        for (let i = 0; i < res.length; i++){
          Vue.set(this.titles, i, res[i]);
        }
        console.log("Done refresh");
      });
  },
  add: function(){
    console.log(this.cur_title);
    console.log(this.input);
    this.$http.post("http://localhost:8080/files", {
      title: this.cur_title,
      text: this.input
    }).then(response =>{
      console.log(response);
    });
  }
  }
})
