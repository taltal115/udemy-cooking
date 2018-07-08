import { Component, OnInit } from '@angular/core';

import { ServersService } from '../servers.service';
import {ActivatedRoute, Data, Params, Router} from "@angular/router";

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.css']
})
export class ServerComponent implements OnInit {
  server: {id: number, name: string, status: string};

  constructor(
    private serversService: ServersService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    // console.log(typeof this.route.snapshot.params['id'])
    // console.log(typeof +this.route.snapshot.params['id'])
    // this.server = this.serversService.getServer(+this.route.snapshot.params['id']);
    // console.log(this.server)
    // this.route.params
      // .subscribe((params: Params) => {
      //   console.log(params)
      //   this.server = this.serversService.getServer(+params.id);
      //
      //   // this.server.id = params['id'];
      //   // this.server.name = params['name'];
      //   // this.server.status = params['status'];
      // });
    this.route.data
      .subscribe(
        (data: Data) => {
          this.server = data['server']
        }
      )
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route, queryParamsHandling: 'preserve'});

  }
}
