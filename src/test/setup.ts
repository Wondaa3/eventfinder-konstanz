import "@testing-library/jest-dom";

// Neuere Node-Versionen bringen ein eigenes localStorage mit, das in der
// Testumgebung nicht benutzbar ist. Für die Tests ersetzen wir es durch eine
// kleine Variante, die die Werte einfach im Speicher hält.
function isUsable() {
  try {
    return typeof localStorage.setItem === "function";
  } catch {
    return false;
  }
}

if (!isUsable()) {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    writable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, String(value));
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => {
        store.clear();
      },
    },
  });
}
