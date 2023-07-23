import { Component, Input } from '@angular/core';

@Component({
  selector: 'shared-lazy-image',
  templateUrl: './lazy-image.component.html'
})
export class LazyImageComponent {

  @Input() url!: string;
  @Input() alt!: string;

  imageLoaded:boolean = false;

  onLoad(): void {
    setTimeout(() => {
      this.imageLoaded = true;
    }, 1000);
  }
}


