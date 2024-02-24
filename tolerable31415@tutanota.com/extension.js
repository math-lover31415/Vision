/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import Clutter from 'gi://Clutter';
import St from 'gi://St';
import GObject from 'gi://GObject';

import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import {QuickToggle, SystemIndicator} from 'resource:///org/gnome/shell/ui/quickSettings.js';

const ExampleToggle = GObject.registerClass(
class ExampleToggle extends QuickToggle {
    constructor() {
        super({
            title: _('Vision'),
            iconName: 'face-smile-symbolic',
            toggleMode: true,
        });
    }
});

const ExampleIndicator = GObject.registerClass(
class ExampleIndicator extends SystemIndicator {
    constructor() {
        super();

        this._indicator = this._addIndicator();
        this._indicator.iconName = 'face-smile-symbolic';

        const toggle = new ExampleToggle();
        toggle.bind_property('checked',
            this._indicator, 'visible',
            GObject.BindingFlags.SYNC_CREATE);
        this.quickSettingsItems.push(toggle);
    }
});

export default class QuickSettingsExampleExtension extends Extension {
    modifyColor(originalColor) {
        let red = 255-originalColor.red; 
        let green = 255-originalColor.green; 
        let blue = 255-originalColor.blue; 
        const modifiedColor = new Clutter.Color({ red, green, blue });
        return modifiedColor;
    }

    traverseContainer(container) {
        if (!container || !container.get_children) {
            return;
        }
        container.get_children().forEach(child => {
            if (child instanceof Clutter.Actor) {
                const currentColor = child.get_paint_color();
                const modifiedColor = this.modifyColor(currentColor);
                child.set_paint_color(modifiedColor);
            }
            if (child instanceof St.Widget) {
                this.traverseContainer(child);
            }
        });
    }

    changeColors(){
        const mainContainer = global.stage.get_child_at_index(0);
        this.traverseContainer(mainContainer);
    }

    enable() {
        this._indicator = new ExampleIndicator();
        Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
        this.changeColors();
    }

    disable() {
        this._indicator.quickSettingsItems.forEach(item => item.destroy());
        this._indicator.destroy();
        this.changeColors();
    }
}
