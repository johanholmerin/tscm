import t from '@babel/types';

export type Compilers = 'babel' | 'typescript';

export interface MacroArgs {
  node: t.CallExpression;
  /**
   * Absolute file path
   */
  fileName: string;
  /**
   * Can be used for not generating expensive types for babel
   */
  compiler: Compilers;
}

export type Macro = ({ node, fileName }: MacroArgs) => t.Node;
