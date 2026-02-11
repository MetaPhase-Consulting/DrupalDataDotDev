import { Theme } from '../../types/Theme';
import { VisualizationData } from '../../types/data';

export interface CodeGeneratorConfig {
  selectedType: string;
  selectedSubtype: string;
  selectedLibrary: string;
  selectedOutputFormat: string;
  selectedTheme: Theme;
  selectedOptions: Record<string, unknown>;
  data: VisualizationData;
}

export interface NormalizedData {
  labels: string[];
  datasets: unknown[];
}

export interface ChartTypeMap {
  [key: string]: string;
}

export interface CodeGenerator {
  generateCode(config: CodeGeneratorConfig): string;
} 
