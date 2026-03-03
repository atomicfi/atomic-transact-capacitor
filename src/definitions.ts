export interface TransactPluginPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
