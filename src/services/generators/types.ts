import { Theme } from '../../types/Theme';

export interface CodeGeneratorConfig {
  selectedType: string;
  selectedSubtype: string;
  selectedLibrary: string;
  selectedOutputFormat: string;
  selectedTheme: Theme;
  selectedOptions: Record<string, any>;
  data: any[];
}

export interface NormalizedData {
  labels: string[];
  datasets: any[];
}

export interface ChartTypeMap {
  [key: string]: string;
}

export interface CodeGenerator {
  generateCode(config: CodeGeneratorConfig): string;
} 