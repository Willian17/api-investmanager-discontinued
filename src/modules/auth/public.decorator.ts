import { applyDecorators } from '@nestjs/common';

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

export function Public() {
  return applyDecorators(SetMetadata(IS_PUBLIC_KEY, true));
}
