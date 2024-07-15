import { React, useState, useEffect } from "react";

import Page from "./component/page";

import PostList from "./container/post-list";

function App() {
  //для кружечка, що прікріплений до курсору

  const [position, setPosition] = useState({ x: 0, y: 0 });

  // useEffect(() => {
  //   function handleMove(e) {
  //     setPosition({ x: e.clientX, y: e.clientY });
  //   }

  //   window.addEventListener("pointermove", handleMove);
  //   return () => {
  //     //при розмонтуванні прибирається
  //     window.removeEventListener("pointermove", handleMove);
  //   };
  // }, []);

  // або

  useWindowListener("pointermove", (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
    <Page>
      <PostList />

      {/* стилі для кружечка */}
      <div
        style={{
          position: "absolute",
          backgroundColor: "pink",
          borderRadius: "50%",
          opacity: 0.6,
          transform: `translate(${position.x}px, ${position.y}px)`,
          pointerEvents: "none",
          left: -20,
          top: -20,
          width: 40,
          height: 40,
        }}
      />
    </Page>
  );
}

//власна функція (загальна) для  використання
// в різних компонентах
//  спрцьовує коли eventType,listener - змінюються
export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);

    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}

export default App;
