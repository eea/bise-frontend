import React from 'react';

const FakeLocation = (props) => {
  const RenderComponent = props.route.renderComponent;
  const pathname = props.location.pathname.includes(props.route.realPathname)
    ? props.location.pathname
    : props.route.realPathname || props.location.pathname;

  return (
    <>
      <RenderComponent
        {...props}
        location={{
          ...props.location,
          pathname,
        }}
      />
    </>
  );
};

export default FakeLocation;
