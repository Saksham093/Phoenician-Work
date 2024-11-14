import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NestedList.css';

function NestedList() {
  const [items, setItems] = useState([]); // Main list of items
  const [expandedItems, setExpandedItems] = useState({}); // Track expanded items

  // Fetch top-level items on mount
  useEffect(() => {
    axios.get('http://localhost:3000/api/projects')
      .then(response => setItems(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Toggle expand/collapse and fetch child items only if not already fetched
  const toggleExpand = async (itemCode) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemCode]: !prev[itemCode]
    }));

    if (!expandedItems[itemCode]) {
      try {
        const response = await axios.get(`http://localhost:3000/api/projects/${itemCode}/details`);
        const newItems = response.data;

        // Add only unique items to avoid duplication
        setItems((prevItems) => [
          ...prevItems,
          ...newItems.filter(newItem => !prevItems.some(item => item.ITEM === newItem.ITEM))
        ]);
      } catch (error) {
        console.error('Error fetching child items:', error);
      }
    }
  };

  // Function to render nested list
  const renderNestedList = (parentCode) => {
    const level = parentCode ? parentCode.split('.').length + 1 : 1;
  
    return items
      .filter(item => {
        if (!item.ITEM) return false; // Check if ITEM is not null or undefined
        const itemLevel = item.ITEM.split('.').length;
        return item.ITEM.startsWith(parentCode ? `${parentCode}.` : '') && itemLevel === level;
      })
      .map((item) => {
        const itemCode = item.ITEM;
        const hasChildren = items.some(
          child => child.ITEM && child.ITEM.startsWith(`${itemCode}.`) && child.ITEM.split('.').length === level + 1
        );
  
        return (
          <div key={itemCode} className="nested-item" style={{ marginLeft: `${level * 20}px` }}>
            <div className="nested-item-header" onClick={() => hasChildren && toggleExpand(itemCode)}>
              {hasChildren && (
                <span className="expand-arrow">
                  {expandedItems[itemCode] ? '▼' : '▶'}
                </span>
              )}
              <span className="item-title">{item.ITEM} - {item.DESCRIPTION}</span>
            </div>
  
            {/* Display table if expanded or if it's a leaf node */}
            {(expandedItems[itemCode] || !hasChildren) && (
              <div className="nested-item-content">
                <table className="nested-item-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Unit</th>
                      <th>Unit Price (AED)</th>
                      <th>Total Price (AED)</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{item.DESCRIPTION || '-'}</td>
                      <td>{item.QUANTITY || '-'}</td>
                      <td>{item.UNIT || '-'}</td>
                      <td>{item["UNIT PRICE(AED)"] || '-'}</td>
                      <td>{item["TOTAL PRICE (AED)"] || '-'}</td>
                      <td>{item.REMARKS || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
  
            {/* Render nested items if expanded */}
            {expandedItems[itemCode] && renderNestedList(itemCode)}
          </div>
        );
      });
  };
  

  return (
    <div className="nested-list">
      <h1>Project Items</h1>
      <div>{renderNestedList('')}</div>
    </div>
  );
}

export default NestedList;
