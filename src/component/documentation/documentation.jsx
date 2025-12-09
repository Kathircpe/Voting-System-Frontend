import React from 'react';
import styles from './documentation.module.css';

const Documentation = () => {
const layers = [
{ name: 'Architecture', icon: '🏗️',link:'https://github.com/Kathircpe/VOTING-SYSTEM/blob/main/README.md' },
{ name: 'Configuration', icon: '⚙️',link:'https://github.com/Kathircpe/VOTING-SYSTEM/blob/main/src/main/java/com/kathir/demo/configuration/README.md' },
{ name: 'Contract', icon: '📄',link: 'https://github.com/Kathircpe/VOTING-SYSTEM/blob/main/src/main/java/com/kathir/demo/contracts/README.md'},
{ name: 'Controller', icon: '🎮',link: 'https://github.com/Kathircpe/VOTING-SYSTEM/blob/main/src/main/java/com/kathir/demo/controller/README.md'},
{ name: 'Model', icon: '📊',link:'https://github.com/Kathircpe/VOTING-SYSTEM/blob/main/src/main/java/com/kathir/demo/models/README.md' },
{ name: 'Repository', icon: '💾',link: 'https://github.com/Kathircpe/VOTING-SYSTEM/blob/main/src/main/java/com/kathir/demo/repository/README.md'},
{ name: 'Service', icon: '🔧' ,link:'https://github.com/Kathircpe/VOTING-SYSTEM/blob/main/src/main/java/com/kathir/demo/service/README.md'},
{ name: 'Utilities', icon: '🛠️',link:'https://github.com/Kathircpe/VOTING-SYSTEM/blob/main/src/main/java/com/kathir/demo/utils/README.md' },
{ name: 'SecurityFilter', icon: '🔐',link:'https://github.com/Kathircpe/VOTING-SYSTEM/blob/main/src/main/java/com/kathir/demo/securityFilter/README.md' },
];

return (
<div className={styles.container}>
<h1 className={styles.heading}>Documentation</h1>
<ul className={styles.list}>
{layers.map((layer, index) => (
<li key={index} className={styles.item} onClick={()=> window.open(layer.link,'_blank','noopener,noreferrer')}>
<span className={styles.icon}>{layer.icon}</span>
<span className={styles.name} >{layer.name}</span>
</li>
))}
</ul>
</div>
);
};

export default Documentation;