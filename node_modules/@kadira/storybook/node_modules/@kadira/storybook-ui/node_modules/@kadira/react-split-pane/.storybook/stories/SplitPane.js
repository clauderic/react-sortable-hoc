import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import Story from 'react-storybook-story';
import 'react-storybook-story/styles.css';

import SplitPane from '../../';
import { nomargin, HSplit } from './_utils';

const stories = storiesOf('SplitPane', module)
  .addDecorator(nomargin);

// ---

stories.add('defaults', function (context) {
  const info = `
    Render with default properties.
  `;

  return (
    <Story context={context} info={info}>
      <SplitPane>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});

stories.add('horizontal', function (context) {
  const info = `
    Split the container horizontally.
  `;

  return (
    <Story context={context} info={info}>
      <SplitPane split='horizontal'>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});

[
  { parent: 'horizontal', child: 'horizontal' },
  { parent: 'horizontal', child: 'vertical' },
  { parent: 'vertical', child: 'horizontal' },
  { parent: 'vertical', child: 'vertical' },
].forEach(splits => {
  stories.add(`${splits.parent}-${splits.child}`, function (context) {
    const info = `
      Nest a ${splits.child} split inside a ${splits.parent} split.
    `;

    return (
      <Story context={context} info={info}>
        <SplitPane split={splits.parent}>
          <div>pane-1</div>
            <SplitPane split={splits.child}>
              <div>pane-1</div>
              <div>pane-2</div>
            </SplitPane>
        </SplitPane>
      </Story>
    );
  });
});

stories.add('default-size', function (context) {
  const info = `
    Split the container with a default size.
  `;

  return (
    <Story context={context} info={info}>
      <SplitPane defaultSize={300}>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});

stories.add('min-max-size', function (context) {
  const info = `
    Split the container with a minimum and maximum size limit.
  `;

  return (
    <Story context={context} info={info}>
      <SplitPane minSize={200} maxSize={400}>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});

stories.add('disable-resize', function (context) {
  const info = `
    Split the container but do not allow resize.
  `;

  return (
    <Story context={context} info={info}>
      <SplitPane allowResize={false}>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});

stories.add('event handlers', function (context) {
  const info = `
    The component supports \`drag-started\`, \`drag-finished\` and \`change\` events.
  `;

  return (
    <Story context={context} info={info}>
      <SplitPane
        onChange={action('change')}
        onDragStarted={action('started')}
        onDragFinished={action('finished')}>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});

stories.add('custom splitter', function (context) {
  const info = `
    Use a custom react component for splitter.
  `;

  return (
    <Story context={context} propTables={[HSplit]} info={info}>
      <SplitPane
        split='horizontal'
        resizerChildren={<HSplit header="Header" onClose={action('close')} />}>
        <div>pane-1</div>
        <div>pane-2</div>
      </SplitPane>
    </Story>
  );
});
