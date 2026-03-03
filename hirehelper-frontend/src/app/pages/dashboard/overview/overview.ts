import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-overview',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './overview.html',
})
export class Overview {
    constructor(public authService: AuthService) { }
}
