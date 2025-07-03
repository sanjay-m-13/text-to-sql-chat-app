export interface DataSummary {
  totalRows: number;
  columns: Array<{
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    uniqueValues: number;
    nullCount: number;
    sampleValues: unknown[];
  }>;
  suggestedChartType: 'bar' | 'line' | 'pie' | 'scatter' | 'table';
  keyInsights: string[];
}

export function analyzeData(data: Record<string, unknown>[]): DataSummary {
  if (!data || data.length === 0) {
    return {
      totalRows: 0,
      columns: [],
      suggestedChartType: 'table',
      keyInsights: ['No data available']
    };
  }

  const columns = Object.keys(data[0]).map(columnName => {
    const values = data.map(row => row[columnName]).filter(val => val !== null && val !== undefined);
    const uniqueValues = new Set(values).size;
    const nullCount = data.length - values.length;
    
    // Determine column type
    let type: 'string' | 'number' | 'date' | 'boolean' = 'string';
    
    if (values.length > 0) {
      const firstValue = values[0];
      
      if (typeof firstValue === 'number') {
        type = 'number';
      } else if (typeof firstValue === 'boolean') {
        type = 'boolean';
      } else if (typeof firstValue === 'string') {
        // Check if it's a date
        const dateValue = new Date(firstValue);
        if (!isNaN(dateValue.getTime()) && firstValue.match(/\d{4}-\d{2}-\d{2}/)) {
          type = 'date';
        } else if (!isNaN(Number(firstValue))) {
          type = 'number';
        }
      }
    }

    return {
      name: columnName,
      type,
      uniqueValues,
      nullCount,
      sampleValues: values.slice(0, 5)
    };
  });

  // Suggest chart type based on data characteristics
  const suggestedChartType = suggestChartType(data, columns);
  
  // Generate insights
  const keyInsights = generateInsights(data, columns);

  return {
    totalRows: data.length,
    columns,
    suggestedChartType,
    keyInsights
  };
}

function suggestChartType(
  data: Record<string, unknown>[], 
  columns: DataSummary['columns']
): DataSummary['suggestedChartType'] {
  const numericColumns = columns.filter(col => col.type === 'number');
  const stringColumns = columns.filter(col => col.type === 'string');
  const dateColumns = columns.filter(col => col.type === 'date');

  // If we have dates and numbers, suggest line chart
  if (dateColumns.length > 0 && numericColumns.length > 0) {
    return 'line';
  }

  // If we have categorical data with counts, suggest bar chart
  if (stringColumns.length > 0 && numericColumns.length > 0) {
    const categoricalCol = stringColumns.find(col => col.uniqueValues <= 10);
    if (categoricalCol) {
      return data.length <= 10 ? 'pie' : 'bar';
    }
  }

  // If we have two numeric columns, suggest scatter plot
  if (numericColumns.length >= 2) {
    return 'scatter';
  }

  // If we have one categorical column with reasonable unique values, suggest bar chart
  if (stringColumns.length > 0) {
    const categoricalCol = stringColumns.find(col => col.uniqueValues <= 20);
    if (categoricalCol && data.length <= 50) {
      return 'bar';
    }
  }

  // Default to table for complex data
  return 'table';
}

function generateInsights(
  data: Record<string, unknown>[],
  columns: DataSummary['columns']
): string[] {
  const insights: string[] = [];

  // Generate business insights based on actual data content
  insights.push(...generateBusinessInsights(data, columns));

  // Add data quality and structure insights
  insights.push(...generateDataQualityInsights(data, columns));

  return insights;
}

function generateBusinessInsights(
  data: Record<string, unknown>[],
  columns: DataSummary['columns']
): string[] {
  const insights: string[] = [];

  // Detect common business patterns and generate specific insights
  const numericCols = columns.filter(col => col.type === 'number');
  const stringCols = columns.filter(col => col.type === 'string');

  // Customer/Order analysis patterns
  if (hasCustomerOrderPattern(data, columns)) {
    insights.push(...analyzeCustomerOrderData(data, columns));
  }

  // Status/Count analysis patterns
  else if (hasStatusCountPattern(data, columns)) {
    insights.push(...analyzeStatusCountData(data, columns));
  }

  // Sales/Revenue analysis patterns
  else if (hasSalesPattern(data, columns)) {
    insights.push(...analyzeSalesData(data, columns));
  }

  // Product/Category analysis patterns
  else if (hasProductPattern(data, columns)) {
    insights.push(...analyzeProductData(data, columns));
  }

  // Generic count/aggregation patterns
  else if (numericCols.length > 0 && stringCols.length > 0) {
    insights.push(...analyzeGenericCountData(data, columns));
  }

  // Detailed record analysis
  else {
    insights.push(...analyzeDetailedRecords(data, columns));
  }

  return insights;
}

function hasCustomerOrderPattern(data: Record<string, unknown>[], columns: DataSummary['columns']): boolean {
  const columnNames = columns.map(c => c.name.toLowerCase());
  return columnNames.some(name => name.includes('customer')) &&
         columnNames.some(name => name.includes('order') || name.includes('count'));
}

function analyzeCustomerOrderData(data: Record<string, unknown>[], columns: DataSummary['columns']): string[] {
  const insights: string[] = [];

  // Look for customer name columns (first_name, last_name, customer_name, etc.)
  const firstNameCol = columns.find(c => c.name.toLowerCase().includes('first_name'))?.name;
  const lastNameCol = columns.find(c => c.name.toLowerCase().includes('last_name'))?.name;
  const customerCol = columns.find(c => c.name.toLowerCase().includes('customer') && !c.name.toLowerCase().includes('count'))?.name;
  const countCol = columns.find(c => c.type === 'number' && (c.name.toLowerCase().includes('count') || c.name.toLowerCase().includes('order')))?.name;

  if (countCol) {
    // Function to get customer display name
    const getCustomerName = (row: Record<string, unknown>): string => {
      if (firstNameCol && lastNameCol) {
        return `${row[firstNameCol]} ${row[lastNameCol]}`;
      } else if (customerCol) {
        return String(row[customerCol]);
      } else if (firstNameCol) {
        return String(row[firstNameCol]);
      }
      return 'Customer';
    };

    // Find customers with highest orders
    const sortedData = [...data].sort((a, b) => Number(b[countCol]) - Number(a[countCol]));
    const topCustomers = sortedData.slice(0, 3).filter(customer => Number(customer[countCol]) > 0);

    if (topCustomers.length > 0) {
      const topCustomerNames = topCustomers.map(customer =>
        `${getCustomerName(customer)} (${customer[countCol]} orders)`
      ).join(', ');
      insights.push(`Top customers by order volume: ${topCustomerNames}.`);
    }

    // Find customers with same order counts (focus on meaningful counts > 1)
    const orderCounts = new Map<string, string[]>();
    data.forEach(row => {
      const count = String(row[countCol]);
      const customerName = getCustomerName(row);
      if (!orderCounts.has(count)) {
        orderCounts.set(count, []);
      }
      orderCounts.get(count)!.push(customerName);
    });

    // Report customers with same order counts
    orderCounts.forEach((customers, count) => {
      if (customers.length > 1 && Number(count) > 1) {
        insights.push(`${customers.join(', ')} each have ${count} orders.`);
      } else if (customers.length > 1 && Number(count) === 1) {
        insights.push(`${customers.length} customers have exactly 1 order each: ${customers.slice(0, 3).join(', ')}${customers.length > 3 ? '...' : ''}.`);
      }
    });

    // Report customers with no orders
    const customersWithNoOrders = data.filter(row => Number(row[countCol]) === 0);
    if (customersWithNoOrders.length > 0) {
      const noOrderCustomers = customersWithNoOrders.map(customer => getCustomerName(customer));
      insights.push(`${noOrderCustomers.join(', ')} ${noOrderCustomers.length === 1 ? 'has' : 'have'} not placed any orders yet.`);
    }

    // Overall statistics
    const totalOrders = data.reduce((sum, row) => sum + Number(row[countCol]), 0);
    const activeCustomers = data.filter(row => Number(row[countCol]) > 0).length;
    insights.push(`Total of ${totalOrders} orders across ${activeCustomers} active customers.`);
  }

  return insights;
}

function hasStatusCountPattern(data: Record<string, unknown>[], columns: DataSummary['columns']): boolean {
  const columnNames = columns.map(c => c.name.toLowerCase());
  return columnNames.some(name => name.includes('status')) &&
         columns.some(c => c.type === 'number');
}

function analyzeStatusCountData(data: Record<string, unknown>[], columns: DataSummary['columns']): string[] {
  const insights: string[] = [];

  const statusCol = columns.find(c => c.name.toLowerCase().includes('status'))?.name;
  const countCol = columns.find(c => c.type === 'number')?.name;

  if (statusCol && countCol) {
    const totalCount = data.reduce((sum, row) => sum + Number(row[countCol]), 0);
    const sortedData = [...data].sort((a, b) => Number(b[countCol]) - Number(a[countCol]));

    if (sortedData.length > 0) {
      const topStatus = sortedData[0];
      const percentage = Math.round((Number(topStatus[countCol]) / totalCount) * 100);
      insights.push(`Most common status is "${topStatus[statusCol]}" with ${topStatus[countCol]} items (${percentage}% of total).`);
    }

    if (sortedData.length > 1) {
      const statusBreakdown = sortedData.map(row =>
        `${row[countCol]} ${row[statusCol]}`
      ).join(', ');
      insights.push(`Status breakdown: ${statusBreakdown}.`);
    }
  }

  return insights;
}

function hasSalesPattern(data: Record<string, unknown>[], columns: DataSummary['columns']): boolean {
  const columnNames = columns.map(c => c.name.toLowerCase());
  return columnNames.some(name => name.includes('sales') || name.includes('revenue') || name.includes('amount'));
}

function analyzeSalesData(data: Record<string, unknown>[], columns: DataSummary['columns']): string[] {
  const insights: string[] = [];

  const salesCol = columns.find(c =>
    c.name.toLowerCase().includes('sales') ||
    c.name.toLowerCase().includes('revenue') ||
    c.name.toLowerCase().includes('amount')
  )?.name;

  if (salesCol) {
    const total = data.reduce((sum, row) => sum + Number(row[salesCol]), 0);
    const average = total / data.length;
    const max = Math.max(...data.map(row => Number(row[salesCol])));

    insights.push(`Total sales: $${total.toLocaleString()}, average per record: $${average.toFixed(2)}.`);
    insights.push(`Highest single amount: $${max.toLocaleString()}.`);
  }

  return insights;
}

function hasProductPattern(data: Record<string, unknown>[], columns: DataSummary['columns']): boolean {
  const columnNames = columns.map(c => c.name.toLowerCase());
  return columnNames.some(name => name.includes('product') || name.includes('category') || name.includes('item'));
}

function analyzeProductData(data: Record<string, unknown>[], columns: DataSummary['columns']): string[] {
  const insights: string[] = [];

  const productCol = columns.find(c =>
    c.name.toLowerCase().includes('product') ||
    c.name.toLowerCase().includes('category') ||
    c.name.toLowerCase().includes('item')
  )?.name;

  if (productCol) {
    const uniqueProducts = new Set(data.map(row => row[productCol]));
    insights.push(`Found ${uniqueProducts.size} different ${productCol.toLowerCase()}s: ${Array.from(uniqueProducts).slice(0, 5).join(', ')}${uniqueProducts.size > 5 ? '...' : ''}.`);
  }

  return insights;
}

function analyzeGenericCountData(data: Record<string, unknown>[], columns: DataSummary['columns']): string[] {
  const insights: string[] = [];

  const stringCol = columns.find(c => c.type === 'string')?.name;
  const numericCol = columns.find(c => c.type === 'number')?.name;

  if (stringCol && numericCol) {
    const sortedData = [...data].sort((a, b) => Number(b[numericCol]) - Number(a[numericCol]));
    const total = data.reduce((sum, row) => sum + Number(row[numericCol]), 0);

    if (sortedData.length > 0) {
      const top = sortedData[0];
      insights.push(`"${top[stringCol]}" leads with ${top[numericCol]} (out of ${total} total).`);
    }

    if (sortedData.length > 1) {
      const breakdown = sortedData.slice(0, 3).map(row =>
        `${row[stringCol]}: ${row[numericCol]}`
      ).join(', ');
      insights.push(`Top entries: ${breakdown}.`);
    }
  }

  return insights;
}

function analyzeDetailedRecords(data: Record<string, unknown>[], columns: DataSummary['columns']): string[] {
  const insights: string[] = [];

  if (data.length <= 5) {
    // Show specific details for small datasets
    data.forEach((row, index) => {
      const details = Object.entries(row)
        .filter(([key, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${key}: ${value}`)
        .slice(0, 3)
        .join(', ');
      insights.push(`Record ${index + 1}: ${details}.`);
    });
  } else {
    // Summarize patterns for larger datasets
    const firstRow = data[0];
    const sampleDetails = Object.entries(firstRow)
      .filter(([key, value]) => value !== null && value !== undefined)
      .slice(0, 2)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    insights.push(`Sample record: ${sampleDetails}... (${data.length} total records).`);
  }

  return insights;
}

function generateDataQualityInsights(
  data: Record<string, unknown>[],
  columns: DataSummary['columns']
): string[] {
  const insights: string[] = [];

  // Data completeness
  const colsWithNulls = columns.filter(col => col.nullCount > 0);
  if (colsWithNulls.length === 0) {
    insights.push(`Data quality is excellent - no missing values found.`);
  } else {
    const missingDataSummary = colsWithNulls.map(col =>
      `${col.name} (${col.nullCount} missing)`
    ).join(', ');
    insights.push(`Some missing data in: ${missingDataSummary}.`);
  }

  return insights;
}
