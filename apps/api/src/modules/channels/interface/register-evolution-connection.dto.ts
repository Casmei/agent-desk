import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class RegisterEvolutionConnectionDto {
  // require_tld: false accepts hosts like localhost and the compose service
  // name; without require_protocol, any bare word would pass as a host.
  @IsUrl({
    require_tld: false,
    require_protocol: true,
    protocols: ['http', 'https'],
  })
  baseUrl!: string;

  @IsString()
  @IsNotEmpty()
  instanceName!: string;

  @IsString()
  @IsNotEmpty()
  apiKey!: string;
}
