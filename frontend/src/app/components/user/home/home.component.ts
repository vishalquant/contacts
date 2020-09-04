import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/services/user.service';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {

  constructor(private userService: UserService) { 
    this.subscription = new Subscription()

  }

  public displayedColumns = ['name', 'email', 'dob', 'location', 'addFriend'];
  public displayedFriendsColumns = ['name', 'email', 'dob', 'location']

  public dataSource = new MatTableDataSource<any>();
  public friendsDataSource = new MatTableDataSource<any>();
  subscription: Subscription
  searchText:string = ""
  errorMsg:string = ""
  successMsg:string =""
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  contacts:any
  defaultPageSize = 10
  totalPages = 5
  pageOptions:any = []
  noRecord:boolean = false
  userId:any
  ngOnInit(): void {

    
    if(localStorage.getItem('user')){
      this.userId = JSON.parse(localStorage.getItem('user'))._id
    }

    const getUsersSubscription =  this.userService.getAllUsers(this.userId).subscribe((data)=>{
      if(data && data["success"])
      console.log(data["data"])
        this.dataSource.data = data["data"] as any[]      
        
        this.errorMsg = ""
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
        if(data && data.name)
          return data.name.toLowerCase().includes(filter);
        else
          {      
            
            return false
          }
        };
    },(err)=>{
      this.errorMsg = err.error.message
    })


    const getFriendsSubscription = this.userService.getAllFriends(this.userId).subscribe((data)=>{
      if(data && data["success"]){
        this.friendsDataSource.data = data["data"] as any[]      
        
        this.errorMsg = ""
      }
    },(err)=>{
      this.errorMsg = err.error.message
    })

    this.subscription.add(getFriendsSubscription)


    for(let i =1;i<= this.totalPages;i++){
      this.pageOptions.push(this.defaultPageSize*i)
    }
    this.subscription.add(getUsersSubscription)

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  filterContacts = (value: string) => {
    value = value.trim().toLowerCase()
    this.dataSource.filter = value;
    this.checkForNoRecord()
  }

  clearSearchField(){
    this.searchText = '';
    this.filterContacts('')
  }

  checkForNoRecord(){
    this.noRecord = this.dataSource.filteredData.length > 0 ? false : true
  }

  addToFriendsList(friend){
   
    console.log(friend)
    if(this.userId){
      const friendSubscription =   this.userService.addFriend(this.userId,friend).subscribe((data)=>{
      if(data && data["success"]){
        this.successMsg = "Contact added successfully to your friend’s list."
        this.errorMsg = ""

        this.friendsDataSource.data = data["data"]["friends"]
      }
    },(err)=>{
      this.errorMsg = err.error.message
      this.successMsg =""
    })
    this.subscription.add(friendSubscription)
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
