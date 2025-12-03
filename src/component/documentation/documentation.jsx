import React from 'react';
import styles from './documentation.module.css';

const Documentation = () => {
const layers = [
{ name: 'Architecture', icon: '🏗️' },
{ name: 'Configuration', icon: '⚙️' },
{ name: 'Contract', icon: '📄' },
{ name: 'Controller', icon: '🎮' },
{ name: 'Model', icon: '📊' },
{ name: 'Repository', icon: '💾' },
{ name: 'Service', icon: '🔧' },
{ name: 'Utilities', icon: '🛠️' },
];

return (
<div className={styles.container}>
<h1 className={styles.heading}>Documentation</h1>
<ul className={styles.list}>
{layers.map((layer, index) => (
<li key={index} className={styles.item}>
<span className={styles.icon}>{layer.icon}</span>
<span className={styles.name}>{layer.name}</span>
</li>
))}
</ul>
</div>
);
};

export default Documentation;