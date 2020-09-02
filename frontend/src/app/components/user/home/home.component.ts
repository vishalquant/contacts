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
  public dataSource = new MatTableDataSource<any>();
  subscription: Subscription
  searchText:string = ""

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  contacts:any
  defaultPageSize = 2
  totalPages = 5
  pageOptions:any = []
  noRecord:boolean = false
  ngOnInit(): void {

    

   const getUsersSubscription =  this.userService.getAllUsers().subscribe((data)=>{
      if(data && data["success"])
        this.dataSource.data = data["data"] as any[]      
        
        
        this.dataSource.filterPredicate = function(data, filter: string): boolean {
        if(data && data.name)
          return data.name.toLowerCase().includes(filter);
        else
          {      
            
            return false
          }
        };

       

    },(err)=>{
      console.log(err.error.message)
    })
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
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
