/**
 * Sample datasets for Multiple Linear Regression
 * Each dataset has multiple feature columns
 */

export interface MLRDataPoint {
  [key: string]: number | string;
}

export interface MLRDataset {
  name: string;
  columns: string[];
  data: MLRDataPoint[];
  rowCount: number;
  suggestedFeatures: string[];
  suggestedTarget: string;
}

export const SAMPLE_DATASETS: { [key: string]: MLRDataset } = {
  house_price_multi: {
    name: 'House Prices (3 features)',
    columns: ['Size_sqft', 'Bedrooms', 'Age_years', 'Price'],
    suggestedFeatures: ['Size_sqft', 'Bedrooms', 'Age_years'],
    suggestedTarget: 'Price',
    data: [
      { Size_sqft: 1500, Bedrooms: 3, Age_years: 10, Price: 250000 },
      { Size_sqft: 2000, Bedrooms: 4, Age_years: 5, Price: 350000 },
      { Size_sqft: 1200, Bedrooms: 2, Age_years: 15, Price: 180000 },
      { Size_sqft: 1800, Bedrooms: 3, Age_years: 8, Price: 290000 },
      { Size_sqft: 2500, Bedrooms: 4, Age_years: 2, Price: 420000 },
      { Size_sqft: 1000, Bedrooms: 2, Age_years: 20, Price: 140000 },
      { Size_sqft: 2200, Bedrooms: 4, Age_years: 6, Price: 380000 },
      { Size_sqft: 1600, Bedrooms: 3, Age_years: 12, Price: 240000 },
      { Size_sqft: 1900, Bedrooms: 3, Age_years: 7, Price: 310000 },
      { Size_sqft: 2300, Bedrooms: 4, Age_years: 4, Price: 390000 },
      { Size_sqft: 1100, Bedrooms: 2, Age_years: 18, Price: 160000 },
      { Size_sqft: 2100, Bedrooms: 4, Age_years: 5, Price: 370000 },
      { Size_sqft: 1400, Bedrooms: 2, Age_years: 14, Price: 200000 },
      { Size_sqft: 1700, Bedrooms: 3, Age_years: 9, Price: 270000 },
      { Size_sqft: 2400, Bedrooms: 4, Age_years: 3, Price: 400000 },
      { Size_sqft: 1300, Bedrooms: 2, Age_years: 16, Price: 190000 },
      { Size_sqft: 2000, Bedrooms: 3, Age_years: 6, Price: 340000 },
      { Size_sqft: 1550, Bedrooms: 3, Age_years: 11, Price: 255000 },
      { Size_sqft: 1850, Bedrooms: 3, Age_years: 8, Price: 300000 },
      { Size_sqft: 2150, Bedrooms: 4, Age_years: 5, Price: 375000 },
    ],
    rowCount: 20,
  },
  
  student_performance: {
    name: 'Student Performance (4 features)',
    columns: ['Hours_Studied', 'Previous_Score', 'Sleep_Hours', 'Practice_Tests', 'Exam_Score'],
    suggestedFeatures: ['Hours_Studied', 'Previous_Score', 'Sleep_Hours', 'Practice_Tests'],
    suggestedTarget: 'Exam_Score',
    data: [
      { Hours_Studied: 5, Previous_Score: 70, Sleep_Hours: 7, Practice_Tests: 3, Exam_Score: 75 },
      { Hours_Studied: 8, Previous_Score: 85, Sleep_Hours: 8, Practice_Tests: 5, Exam_Score: 92 },
      { Hours_Studied: 3, Previous_Score: 60, Sleep_Hours: 5, Practice_Tests: 2, Exam_Score: 65 },
      { Hours_Studied: 6, Previous_Score: 75, Sleep_Hours: 7, Practice_Tests: 4, Exam_Score: 82 },
      { Hours_Studied: 9, Previous_Score: 90, Sleep_Hours: 8, Practice_Tests: 6, Exam_Score: 95 },
      { Hours_Studied: 2, Previous_Score: 55, Sleep_Hours: 4, Practice_Tests: 1, Exam_Score: 58 },
      { Hours_Studied: 7, Previous_Score: 80, Sleep_Hours: 7, Practice_Tests: 4, Exam_Score: 88 },
      { Hours_Studied: 4, Previous_Score: 65, Sleep_Hours: 6, Practice_Tests: 2, Exam_Score: 70 },
      { Hours_Studied: 8, Previous_Score: 82, Sleep_Hours: 8, Practice_Tests: 5, Exam_Score: 90 },
      { Hours_Studied: 5, Previous_Score: 72, Sleep_Hours: 6, Practice_Tests: 3, Exam_Score: 78 },
      { Hours_Studied: 6, Previous_Score: 78, Sleep_Hours: 7, Practice_Tests: 4, Exam_Score: 85 },
      { Hours_Studied: 3, Previous_Score: 62, Sleep_Hours: 5, Practice_Tests: 2, Exam_Score: 68 },
      { Hours_Studied: 9, Previous_Score: 88, Sleep_Hours: 8, Practice_Tests: 6, Exam_Score: 94 },
      { Hours_Studied: 4, Previous_Score: 68, Sleep_Hours: 6, Practice_Tests: 3, Exam_Score: 73 },
      { Hours_Studied: 7, Previous_Score: 83, Sleep_Hours: 7, Practice_Tests: 5, Exam_Score: 89 },
    ],
    rowCount: 15,
  },
  
  employee_salary: {
    name: 'Employee Salary (2 features)',
    columns: ['Years_Experience', 'Education_Level', 'Salary'],
    suggestedFeatures: ['Years_Experience', 'Education_Level'],
    suggestedTarget: 'Salary',
    data: [
      { Years_Experience: 1, Education_Level: 12, Salary: 40000 },
      { Years_Experience: 3, Education_Level: 16, Salary: 55000 },
      { Years_Experience: 5, Education_Level: 18, Salary: 75000 },
      { Years_Experience: 7, Education_Level: 16, Salary: 82000 },
      { Years_Experience: 10, Education_Level: 18, Salary: 110000 },
      { Years_Experience: 2, Education_Level: 14, Salary: 48000 },
      { Years_Experience: 4, Education_Level: 16, Salary: 62000 },
      { Years_Experience: 6, Education_Level: 18, Salary: 78000 },
      { Years_Experience: 8, Education_Level: 16, Salary: 92000 },
      { Years_Experience: 12, Education_Level: 20, Salary: 130000 },
      { Years_Experience: 1, Education_Level: 14, Salary: 42000 },
      { Years_Experience: 3, Education_Level: 18, Salary: 58000 },
      { Years_Experience: 5, Education_Level: 16, Salary: 70000 },
      { Years_Experience: 7, Education_Level: 18, Salary: 88000 },
      { Years_Experience: 9, Education_Level: 20, Salary: 105000 },
    ],
    rowCount: 15,
  },
};

export type { MLRDataPoint as DataPoint, MLRDataset as Dataset };
