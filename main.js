import AppBuilder from './src/appBuilder.js';
import FontFormat from './lib/fontFormat.js';
import './lib/kt-dot.js';
import './lib/duplication.js';

//this.#loadedProject = new DuplicateDraw();

window.onload = () => {
  const img = new Image();
  img.src = './imgs/gogh1.jpg';
  img.onload = () => {
    new AppBuilder()
      //.addProject('Duplication', { month: 'JULY', year: '2022' }, )
      .addProject(
        'KT-Dot',
        { month: 'JULY', year: '2022' },
        new kt.Dot(new FontFormat(800, 700, 'Arial'), 'JS')
      )
      .addProject(
        'Duplication',
        { month: 'JULY', year: '2022' },
        new DuplicateDraw(img)
      )
      .build();
  };
};
