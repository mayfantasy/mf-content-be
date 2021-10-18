import { Module } from '@nestjs/common';
import { ShortcutService } from './shortcut.service';

@Module({
  providers: [ShortcutService]
})
export class ShortcutModule {}
