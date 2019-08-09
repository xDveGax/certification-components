import { Component, Output, Input, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AlertComponent {
  @Input() message: string;
  @Input() actionButtonText: string;
  @Output() sendAction: EventEmitter<any> = new EventEmitter();

  onAction() {
    this.sendAction.emit();
  }
}
