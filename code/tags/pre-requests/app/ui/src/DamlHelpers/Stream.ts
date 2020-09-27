import Ledger, { CreateEvent, Stream as DamlStream, StreamCloseEvent, Query } from "@daml/ledger";
import { Template } from "@daml/types";

export class Stream<Templ extends Template<any,any,any>, 
              T extends object=(Templ extends Template<infer A,any,any> ? A : never), 
              K extends  any  =(Templ extends Template<any,infer A,any> ? A : never),
              I extends string=(Templ extends Template<any,any,infer A> ? A : never)
            > {
  constructor(ledger: Ledger, template: Templ, query?: Query<T>) {
    this.stream = ledger.streamQuery(template, query);
  }

  private stream: DamlStream<T, K, I, readonly CreateEvent<T, K, I>[]>;

  onLive(func: () => void) {
    this.stream.on('live', func);
  }

  onChange(func: (results: ReadonlyArray<CreateEvent<T, K, I>>) => void) {
    this.stream.on('change', func);
  }

  onClose(func: (closeEvent: StreamCloseEvent) => void) {
    this.stream.on('close', func);
  }

  close() {
    this.stream.close();
  }
}

