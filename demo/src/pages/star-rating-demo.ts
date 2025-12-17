import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@deepverse/zero-ui/star-rating';
import '../components/demo-page';
import '../components/demo-example';

@customElement('star-rating-demo')
export class StarRatingDemo extends LitElement {
  static styles = css`
    .output {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
  `;

  @state() private _rating1 = 0;
  @state() private _rating2 = 3;
  @state() private _rating3 = 4;

  render() {
    const properties = [
      { name: 'value', type: 'number', default: '0', description: 'Current rating value.' },
      { name: 'max', type: 'number', default: '5', description: 'Maximum rating value.' },
      { name: 'readonly', type: 'boolean', default: 'false', description: 'Read-only mode.' },
    ];

    const basicHtml = `<zui-star-rating
  .value="\${value}"
  @zui-rating-change="\${handleChange}"
></zui-star-rating>`;

    const basicReact = `import { ZuiStarRating } from '@deepverse/zero-ui/star-rating';

function App() {
  const [value, setValue] = useState(0);
  return (
    <ZuiStarRating
      value={value}
      onZuiRatingChange={(e) => setValue(e.detail.value)}
    />
  );
}`;

    const basicAngular = `import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: \`
    <zui-star-rating 
      [value]="value" 
      (zui-rating-change)="handleChange($event)">
    </zui-star-rating>
  \`
})
export class AppComponent {
  value = 0;
  handleChange(e: any) {
    this.value = e.detail.value;
  }
}`;

    const basicVue = `<template>
  <zui-star-rating 
    :value="value" 
    @zui-rating-change="value = $event.detail.value" 
  />
</template>

<script setup>
import { ref } from 'vue';
const value = ref(0);
</script>`;

    const customMaxHtml = `<zui-star-rating max="10" value="3"></zui-star-rating>`;
    const readOnlyHtml = `<zui-star-rating readonly value="4"></zui-star-rating>`;
    const fractionalHtml = `<zui-star-rating readonly value="4.2"></zui-star-rating>`;

    return html`
      <demo-page
        name="Star Rating"
        description="A customizable star rating component."
        .properties=${properties}
      >
        <demo-example
          header="Basic Usage"
          description="Interactive star rating."
          .html=${basicHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; flex-direction: column; align-items: center;">
            <zui-star-rating
              .value=${this._rating1}
              @zui-rating-change=${(e: CustomEvent) => this._rating1 = e.detail.value}
            ></zui-star-rating>
            <div class="output">Current Rating: ${this._rating1} / 5</div>
          </div>
        </demo-example>

        <demo-example
          header="Custom Max Stars (10)"
          description="Rating out of 10."
          .html=${customMaxHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; flex-direction: column; align-items: center;">
            <zui-star-rating
              max="10"
              .value=${this._rating2}
              @zui-rating-change=${(e: CustomEvent) => this._rating2 = e.detail.value}
            ></zui-star-rating>
            <div class="output">Current Rating: ${this._rating2} / 10</div>
          </div>
        </demo-example>

        <demo-example
          header="Read Only"
          description="Display rating without interaction."
          .html=${readOnlyHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; flex-direction: column; align-items: center;">
            <zui-star-rating
              readonly
              .value=${this._rating3}
            ></zui-star-rating>
            <div class="output">Rating: ${this._rating3} / 5 (Cannot be changed)</div>
          </div>
        </demo-example>

        <demo-example
          header="Fractional / Average Values"
          description="Display fractional values (e.g. 4.2)."
          .html=${fractionalHtml}
          .react=${basicReact}
          .angular=${basicAngular}
          .vue=${basicVue}
        >
          <div style="display: flex; gap: 2rem; align-items: center; flex-wrap: wrap; justify-content: center;">
            <div style="display: flex; flex-direction: column; align-items: center;">
              <zui-star-rating readonly value="4.2"></zui-star-rating>
              <div class="output">4.2 / 5</div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <zui-star-rating readonly value="3.5"></zui-star-rating>
              <div class="output">3.5 / 5</div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center;">
              <zui-star-rating readonly value="1.8"></zui-star-rating>
              <div class="output">1.8 / 5</div>
            </div>
          </div>
        </demo-example>
      </demo-page>
    `;
  }
}
