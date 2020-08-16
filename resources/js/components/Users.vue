<template>
  <div class="users">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-12">
          <div class="card">
            <div class="card-header border-transparent">
              <h3 class="card-title">Users</h3>

              <div class="card-tools">
                <button
                  type="button"
                  @click="setCreate"
                  class="btn btn-primary"
                  data-toggle="modal"
                  data-target="#createUser"
                >
                  Add new
                  <i class="fas fa-user-plus"></i>
                </button>
                <!-- <button type="button" class="btn btn-tool" data-card-widget="remove">
                      
                    <i class="fas fa-times"></i>
                </button>-->
              </div>
            </div>
            <!-- /.card-header -->
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table m-0">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Email</th>
                      <th>Registered At</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="user in users.data" :key="user.id">
                      <td>{{user.id}}</td>
                      <td>{{user.name}}</td>
                      <td>
                        <span :class="user.type | colorType">{{user.type | toUpper}}</span>
                      </td>
                      <td>{{user.email}}</td>
                      <td>{{user.created_at | parsTime}}</td>
                      <td>
                        <button
                          @click="setEdit(user)"
                          style="border: solid black 1px;"
                          class="btn btn-warning btn-sm"
                          data-toggle="modal"
                          data-target="#createUser"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <span style="width: 4px;margin:4px"></span>
                        <button @click="removeUser(user.id)" class="btn btn-danger btn-sm">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!-- /.table-responsive -->
            </div>
            <!-- /.card-body -->
            <!-- <div class="card-footer clearfix">
                <a href="javascript:void(0)" class="btn btn-sm btn-info float-left">Place New Order</a>
                <a href="javascript:void(0)" class="btn btn-sm btn-secondary float-right">View All Orders</a>
            </div>-->
            <!-- /.card-footer -->
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="createUser"
      tabindex="-1"
      role="dialog"
      aria-labelledby="createUserLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5
              class="modal-title"
              id="createUserLabel"
            >{{formAction ? 'Add New User' : `Edit User ${form.name}`}}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form
              @submit.prevent="formAction ? createUser() : updateUser()"
              @keydown="form.onKeydown($event)"
            >
              <div class="form-group">
                <label>Username</label>
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('name') }"
                />
                <has-error :form="form" field="username"></has-error>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('email') }"
                />
                <has-error :form="form" field="email"></has-error>
              </div>

              <div class="form-group">
                <label>Password</label>
                <input
                  v-model="form.password"
                  type="password"
                  name="password"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('password') }"
                />
                <has-error :form="form" field="password"></has-error>
              </div>
              <div class="form-group">
                <label>Type</label>
                <select
                  v-model="form.type"
                  id="type"
                  name="type"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('type') }"
                >
                  <option value>Select User Role</option>
                  <option value="admin">Admin</option>
                  <option value="author">Author</option>
                  <option value="user">User</option>
                </select>
                <has-error :form="form" field="type"></has-error>
              </div>
              <div class="form-group">
                <label>Photo</label>
                <input
                  v-model="form.img"
                  type="text"
                  name="img"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('img') }"
                />
                <has-error :form="form" field="Profile Photo"></has-error>
              </div>
              <div class="form-group">
                <label>Bio</label>
                <textarea
                  v-model="form.bio"
                  name="bio"
                  id="bio"
                  class="form-control"
                  :class="{ 'is-invalid': form.errors.has('bio') }"
                ></textarea>
                <has-error :form="form" field="Short bio for user"></has-error>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                <button
                  :disabled="form.busy"
                  type="submit"
                  class="btn btn-primary"
                >{{formAction ? "Create" : "Update"}}</button>

                <!-- <button type="submit" class="btn btn-primary">Save</button> -->
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
export default {
  name: "users",
  created() {
    this.loadUsers();
    FireAjax.$on("AfterEnterInDB", () => this.loadUsers());
    FireAjax.$on("removedUser", () => this.loadUsers());
  },
  data() {
    return {
      // Create a new form instance
      form: new Form({
        id: "",
        name: "",
        email: "",
        password: "",
        type: "",
        bio: "",
        img: "",
      }),
      users: {},
      formAction: true,
    };
  },
  methods: {
    createUser() {
      //start progress bar
      this.$Progress.start();
      // Submit the form via a POST request
      this.form
        .post("api/user")
        .then(() => {
          this.$Progress.finish();

          //swal
          Toast.fire({
            icon: "success",
            title: "User created successfully",
          });
          //close modal
          $("#createUser").modal("hide");
          //Emit event when created
          FireAjax.$emit("AfterEnterInDB");
          // clear vform
          this.form.reset();
        })
        .catch((err) => {
          console.log(err);
          //end progress bar
          this.$Progress.finish();
        });
    },
    updateUser() {
      //start progress bar
      this.$Progress.start();
      this.form
        .put(`api/user/${this.form.id}`)
        .then(() => {
          this.$Progress.finish();
          FireAjax.$emit("AfterEnterInDB");
          //swal
          Toast.fire({
            icon: "success",
            title: "User updated successfully",
          });
          $("#createUser").modal("hide");
        })
        .catch(() => {
          this.$Progress.finish();
        });
    },
    removeUser(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          this.form
            .delete(`api/user/${id}`)
            .then(() => {
              FireAjax.$emit("removedUser");
              Swal.fire(
                "Deleted!",
                "User with id: " + id + " has been deleted.",
                "success"
              );
            })
            .catch(() =>
              swal("Failed", `Can't delete user with id: ${id}`, "warning")
            );
        }
      });

      // Axios.delete(`api/user/${id}`)
    },
    setEdit(user) {
      this.form.reset();
      this.formAction = false;
      this.form.fill(user);
      // $('#createUser').modal('show')
    },
    setCreate() {
      this.form.reset();
      this.formAction = true;
    },
    editUser(user) {
      console.log(user);
    },
    loadUsers() {
      this.$Progress.start();

      Axios.get("api/user").then((res) => {
        this.users = res.data.users;
        this.$Progress.finish();
      });
    },
  },
};
</script>

<style>
</style>