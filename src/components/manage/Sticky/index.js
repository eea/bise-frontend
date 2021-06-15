import React from 'react';

const StickyContext = new React.createContext();

const StickyProvider = (props) => {
  const stickyRef = React.useRef();

  return (
    <StickyContext.Provider value={{ stickyRef: stickyRef.current }}>
      <div ref={stickyRef} className="sticky-provider">
        {props.children}
      </div>
    </StickyContext.Provider>
  );
};

export { StickyContext, StickyProvider };
