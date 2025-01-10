export const fileStructure = [
  {
    name: 'src',
    type: 'folder' as const,
    children: [
      {
        name: 'components',
        type: 'folder' as const,
        children: [
          { 
            name: 'Button.tsx', 
            type: 'file' as const,
            content: `import React from 'react';

const Button = ({ children }) => {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      {children}
    </button>
  );
};

export default Button;`
          },
          { 
            name: 'Input.tsx', 
            type: 'file' as const,
            content: `import React from 'react';

const Input = ({ placeholder }) => {
  return (
    <input 
      className="border rounded px-3 py-2" 
      placeholder={placeholder}
    />
  );
};

export default Input;`
          },
        ]
      },
      { 
        name: 'App.tsx', 
        type: 'file' as const,
        content: `import React from 'react';
import Button from './components/Button';

function App() {
  return (
    <div className="app">
      <h1>Welcome to My App</h1>
      <Button>Click me</Button>
    </div>
  );
}`
      },
    ]
  },
];
