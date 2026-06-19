import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthLanguageBridgeService } from './services/auth-language-bridge.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthValidationMessagesService } from './services/auth-validation-messages.service';

@Component({
  selector: 'app-auth',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe],
  providers: [AuthValidationMessagesService],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  private readonly authLanguageBridgeService = inject(AuthLanguageBridgeService);

  ngOnInit(): void {
    this.authLanguageBridgeService.init();
  }
}
