import { CodeGeneratorConfig } from './generators/types';
import { JavaScriptEmbedGenerator } from './generators/JavaScriptEmbedGenerator';
import { StaticHTMLGenerator } from './generators/StaticHTMLGenerator';
import { DrupalBlockGenerator } from './generators/DrupalBlockGenerator';
import { DrupalControllerGenerator } from './generators/DrupalControllerGenerator';
import { BaseGenerator } from './generators/BaseGenerator';

// Re-export the types for external use
export type { CodeGeneratorConfig } from './generators/types';

export class CodeGenerator {
  static generateCode(config: CodeGeneratorConfig): string {
    const { selectedOutputFormat } = config;
    
    // Sanitize data before including in code
    const sanitizedData = BaseGenerator.sanitizeForCodeGeneration(config.data);
    const sanitizedOptions = BaseGenerator.sanitizeForCodeGeneration(config.selectedOptions);
    
    const sanitizedConfig: CodeGeneratorConfig = {
      ...config,
      data: sanitizedData,
      selectedOptions: sanitizedOptions
    };
    
    // Generate code based on output format
    switch (selectedOutputFormat) {
      case 'javascript-embed':
        return JavaScriptEmbedGenerator.generateCode(sanitizedConfig);
      case 'static-html':
        return StaticHTMLGenerator.generateCode(sanitizedConfig);
      case 'drupal-block':
        return DrupalBlockGenerator.generateCode(sanitizedConfig);
      case 'drupal-controller':
        return DrupalControllerGenerator.generateCode(sanitizedConfig);
      default:
        return JavaScriptEmbedGenerator.generateCode(sanitizedConfig);
    }
  }
} 