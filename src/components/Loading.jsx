import React from "react";
import '../index.css'

const Loading = ({ visible }) => {
    const styles = {
        overlay: {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            pointerEvents: "all",
        },
        spinner: {
            width: "60px",
            height: "60px",
            border: "6px solid #f3f3f3",
            borderTop: "6px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
        },
    };

    const styleSheet = document.styleSheets[0];
    const keyframes = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    `;
    if (styleSheet) {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
    }
    if (!visible) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.spinner}></div>
        </div>
    );
};



export default Loading;